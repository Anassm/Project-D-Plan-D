import Fastify, { fastify } from "fastify";
import {showRoutes} from "./routes/touchpointsRoutes";
export const server = Fastify();

const start = async () => {
    try
    {
      showRoutes(server);
        await server.listen({ port: 3000 });
        console.log('Server listening on port 3000');
    } catch (err)
    {
        console.log(err);
        process.exit(1);
    }
};
server.get("/", async (request, reply) => {
  console.log("Request received");
    });
start();