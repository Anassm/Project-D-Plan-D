import Fastify from "fastify";
import cors from "@fastify/cors";
import showRoutes from "./routes/touchpointsRoutes";
import { flightsRoutes } from "./routes/flightsRoutes";
import dotenv from "dotenv";
import authentication from "./plugins/authentication";
import fs from "fs";
import path from "path";
import swaggerPlugin from "./plugins/swagger";
import rateLimit from "@fastify/rate-limit";

dotenv.config();
const backendPort: number = Number(process.env.API_PORT);

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "server.key")),
  cert: fs.readFileSync(path.join(__dirname, "server.cert")),
};

export const server = Fastify({
  https: httpsOptions,
});

const startServer = async () => {
  await server.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
  });

  await server.register(rateLimit, {
    max: 300000,
    timeWindow: "1 minute",
    ban: 10000,
  });

  await server.register(swaggerPlugin); // Register before routes
  await server.register(authentication);
  await server.register(showRoutes);
  await server.register(flightsRoutes);

  try {
    await server.listen({ port: backendPort, host: "0.0.0.0" });
    await server.ready();
    console.log(`✅ Server listening on https://localhost:${backendPort}`);
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    throw err;
  }
};

startServer(); // Start async server
