"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const db_1 = require("./db");
const app = (0, fastify_1.default)({ logger: true });
// GET /users endpoint
app.get('/users', async (request, reply) => {
    try {
        const result = await (0, db_1.query)('SELECT * FROM users');
        reply.send(result.rows);
    }
    catch (err) {
        app.log.error(err);
        reply.status(500).send({ error: 'Server error' });
    }
});
// Start the server
const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log('Server is running on http://localhost:3000');
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
