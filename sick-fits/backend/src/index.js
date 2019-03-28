require("dotenv").config();
const createServer = require("./create-server");
const db = require("./db");

(async () => {
    const server = await createServer();
    server.start({
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL
        }
    }, it => {
        console.log("Server running on port", it.port);
    });
})().catch(console.error);
