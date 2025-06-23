import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { FastifyPluginAsync } from "fastify";

const swaggerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  if (process.env.NODE_ENV === "test") return;

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "RTHA API",
        version: "1.0.0",
        description: "API documentation for RTHA project",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
    },
  });

  // Optional: log the Swagger URL
  fastify.log.info("Swagger docs available at /docs");
});

export default swaggerPlugin;
