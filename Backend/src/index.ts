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

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const backendPort: number = Number(process.env.API_PORT);

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "server.key")),
  cert: fs.readFileSync(path.join(__dirname, "server.cert")),
};

export const server = Fastify({
  https: httpsOptions,
});

server.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});

const startServer = async () => {
  await server.register(rateLimit, {
    max: 300000,
    timeWindow: "1 minute",
    // allowList: ["127.0.0.1"],
    ban: 10000,
  });

  server.register(swaggerPlugin);
  server.register(authentication);
  server.register(showRoutes);
  server.register(flightsRoutes);

  try {
    await server.listen({ port: backendPort, host: "0.0.0.0" });
    console.log(`Server listening on port ${backendPort}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer(); // <--- roept de async functie aan
