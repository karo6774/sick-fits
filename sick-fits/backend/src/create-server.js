const {GraphQLServer} = require("graphql-yoga");
const Mutation = require("./resolvers/mutation");
const Query = require("./resolvers/query");
const db = require("./db");
const ImageStore = require("./image-store");
const streamToBuffer = require("./stream-to-buffer");

async function createServer() {
    const imageStore = await ImageStore.connect("sick-fits_dev");
    const server = new GraphQLServer({
        typeDefs: "src/schema.graphql",
        resolvers: {Mutation, Query},
        resolverValidationOptions: {
            requireResolversForResolveType: false
        },
        context: params => ({...params, db, imageStore})
    });
    server.express.get("/images/:id", async (req, res) => {
        const image = imageStore.findImage(req.params.id);
        if (image === null) {
            return res.status(404).send().end();
        }
        try {
            const buf = await streamToBuffer(image);
            res
                .set("Content-Type", "image/png")
                .set("Content-Length", image.s.file.length)
                .status(200).send(buf).end();
        } catch (err) {
            if (err.code === "ENOENT") {
                res.status(404).send().end();
            } else {
                res.status(500).send().end();
                console.error(err);
            }
        }

    });
    return server;
}

module.exports = createServer;
