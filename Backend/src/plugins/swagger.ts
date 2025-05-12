import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export default fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "RTHA API",
        version: "1.0.0",
        description: "API documentation for RTHA project",
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
  });
});
