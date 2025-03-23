"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const queries_1 = require("./queries");
const server = (0, fastify_1.default)();
server.get("/api/:table", async (request, reply) => {
    try {
        const { table } = request.params;
        const data = await (0, queries_1.getAllDataFromTable)(table);
        reply.send(data);
    }
    catch (err) {
        console.error('Error:', err);
        reply.status(500).send({ error: 'Internal server error' });
    }
});
const start = async () => {
    try {
        await server.listen({ port: 3000 });
        console.log('Server listening on port 3000');
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
};
start();
