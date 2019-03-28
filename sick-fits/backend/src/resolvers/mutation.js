const Sharp = require("sharp");
const Streamifier = require("streamifier");
const streamToBuffer = require("../stream-to-buffer");

const mutations = {
    async createItem(parent, args, context, info) {
        const image = await args.image;
        const buf = await streamToBuffer(image.stream);

        async function upload(width, height) {
            const resized = await context.imageStore.resizeImage(buf, width, height);
            const stream = Streamifier.createReadStream(resized);
            return await context.imageStore.uploadImage(stream, image.filename);
        }

        const id = await upload(500, 500);
        const largeId = await upload(1000, 1000);

        return await context.db.mutation.createItem({
            data: {...args, image: id.toString(), largeImage: largeId.toString()}
        }, info);
    },
    updateItem(parent, args, context, info) {
        const updates = {...args};
        delete updates.id;
        return context.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info);
    },
    async deleteItem(parent, args, context, info) {
        console.log(args);
        const where = {id: args.id};
        const item = await context.db.query.item({where}, `{id title}`);
        return context.db.mutation.deleteItem({where}, info);
    }
};

module.exports = mutations;
