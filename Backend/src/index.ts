import Fastify from "fastify";
import { showRoutes } from "./routes/touchpointsRoutes";
import dotenv from "dotenv";
import authentication from "./plugins/authentication";

dotenv.config();

export const server = Fastify();
server.register(authentication);
const port: Number = 3000;

showRoutes(server);
server.listen({ port: Number(process.env.API_PORT) }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  console.log(`Server listening on port ${port}`);
});
