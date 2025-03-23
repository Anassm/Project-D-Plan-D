import { FastifyInstance } from "fastify";
import {getAllDataFromTable} from "../controllers/touchpointsController";
import {server} from "../index";

export const showRoutes = (server: FastifyInstance) => {
    server.get("/api/show/:table/:number", async (request, reply) => {
        try
        {
            const {table, number} = request.params as {table: string, number: number};
            const data = await getAllDataFromTable(table, number);
            reply.send(data);
        } catch (err)
        {
            console.error('Error:', err);
            reply.status(500).send({error: 'Internal server error'});
        }
    });

    server.get("/api/show/:table", async (request, reply) => {
        try
        {
            const {table, number} = request.params as {table: string, number: number};
            const data = await getAllDataFromTable(table);
            reply.send(data);
        } catch (err)
        {
            console.error('Error:', err);
            reply.status(500).send({error: 'Internal server error'});
        }
    });
}