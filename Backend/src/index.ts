import Fastify from "fastify";
import cors from "@fastify/cors";
import showRoutes from "./routes/touchpointsRoutes";
import { flightsRoutes } from "./routes/flightsRoutes";
import dotenv from "dotenv";
import authentication from "./plugins/authentication";
import rateLimit from '@fastify/rate-limit';
import { FastifyRequest, FastifyReply } from "fastify";
import { RateLimitOptions} from "@fastify/rate-limit";



dotenv.config();
const backendPort: number = Number(process.env.API_PORT);

export const server = Fastify();

server.register<RateLimitOptions>(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: function (
    req: FastifyRequest,
    context // no need to type this — it's inferred
  ): Record<string, unknown> {
    return {
      code: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again later.`,
    };
  }
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
