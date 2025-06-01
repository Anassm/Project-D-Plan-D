import Fastify from "fastify";
import cors from "@fastify/cors";
import showRoutes from "./routes/touchpointsRoutes";
import { flightsRoutes } from "./routes/flightsRoutes";
import dotenv from "dotenv";
import authentication from "./plugins/authentication";
import swaggerPlugin from "./plugins/swagger";
import rateLimit from "@fastify/rate-limit";

dotenv.config();
const backendPort: number = Number(process.env.API_PORT);


export const server = Fastify();
server.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});
server.register(swaggerPlugin);
server.register(authentication);
server.register(showRoutes);
server.register(flightsRoutes);

const startServer = async () => {
  await server.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    allowList: ["127.0.0.1"],
    ban: 2,
  });

  try {
    await server.listen({ port: backendPort, host: "0.0.0.0" });
    console.log(`Server listening on port ${backendPort}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer(); // <--- roept de async functie aan
