const {MongoClient, GridFSBucket, ObjectId} = require("mongodb");
const Sharp = require("sharp");

class ImageStore {
    constructor(db) {
        this.db = db;
        this.grid = new GridFSBucket(db, "fs");
    }

    static async connect(dbName) {
        const db = await MongoClient.connect(process.env.MONGODB_URL, {
            auth: {user: process.env.MONGODB_USERNAME, password: process.env.MONGODB_PASSWORD}
        });
        return new ImageStore(db.db(dbName));
    }

    uploadImage(stream, name) {
        const upload = this.grid.openUploadStream(name);
        stream.pipe(upload);
        return new Promise((resolve, reject) => {
            upload.on("finish", () => resolve(upload.id));
            upload.on("error", reject);
        })
    }

    findImage(id) {
        try {
            return this.grid.openDownloadStream(new ObjectId(id));
        } catch (err) {
            return null;
        }
    }

    async resizeImage(buffer, width, height) {
        try {
            return await Sharp(buffer)
                .resize(width, height)
                .toBuffer();
        } catch(err) {
            throw new Error("Unsupported image format");
        }
    }
}

module.exports = ImageStore;