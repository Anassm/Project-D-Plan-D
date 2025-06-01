import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeRoles: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}