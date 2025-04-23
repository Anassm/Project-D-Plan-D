import Fastify from "fastify";
import showRoutes from "./routes/touchpointsRoutes";

import { flightsRoutes } from "./routes/flightsRoutes";

import dotenv from "dotenv";
import authentication from "./plugins/authentication";

dotenv.config();

export const server = Fastify();
server.register(authentication);
server.register(showRoutes);
server.register(flightsRoutes);

const port: number = Number(process.env.API_PORT);

server.listen({ port: port }, function (err, address) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }

  console.log(`Server listening on port ${port}`);
});
