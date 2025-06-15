// app.ts
import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import authentication from "./plugins/authentication";
import showRoutes from "./routes/touchpointsRoutes";
import { flightsRoutes } from "./routes/flightsRoutes";
import swaggerPlugin from "./plugins/swagger";

export const buildApp = async (options = {}): Promise<FastifyInstance> => {
  const server = Fastify(options);

  await server.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
  });

  await server.register(rateLimit, {
    max: 300000,
    timeWindow: "1 minute",
    ban: 10000,
  });

  await server.register(swaggerPlugin);
  await server.register(authentication);
  await server.register(showRoutes);
  await server.register(flightsRoutes);

  return server;
};
