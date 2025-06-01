import Fastify from "fastify";
import cors from "@fastify/cors";
import showRoutes from "./routes/touchpointsRoutes";
import { flightsRoutes } from "./routes/flightsRoutes";
import dotenv from "dotenv";
import authentication from "./plugins/authentication";
import fs from 'fs';
import path from 'path';

dotenv.config();
const backendPort: number = Number(process.env.API_PORT);

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.cert')),
};

export const server = Fastify({
  https: httpsOptions,
});
server.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});
server.register(authentication);
server.register(showRoutes);
server.register(flightsRoutes);

server.listen({ port: backendPort }, function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening on port ${backendPort}`);
});
