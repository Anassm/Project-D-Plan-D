import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";

export function createQueryRoute<T>(
  server: any,
  path: string,
  queryParam: keyof T,
  serviceFunction: (param: string) => Promise<any>
) {
  server.get(path, { preValidation: [server.authenticate] }, 
    async (request : FastifyRequest<{ Querystring: T }>, reply : FastifyReply) => {
    try {
      const query = request.query as T;
      const paramValue = query[queryParam];

      if (!paramValue) {
        return reply.status(400).send({ error: `Missing ${String(queryParam)} query param` });
      }

      const data = await serviceFunction(paramValue as string);
      reply.send(data);
    } catch (err) {
      console.error("Error:", err);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
}
