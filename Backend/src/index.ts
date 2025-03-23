import { fastify } from "fastify";

const server = fastify({ logger: true });
const port: number = 8080;

server.listen({ port }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  server.log.info(`Server running on port ${port}`);
});