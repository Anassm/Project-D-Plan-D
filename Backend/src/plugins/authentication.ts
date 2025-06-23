import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

if (!jwtSecretKey) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables");
}

export default fp(async (fastify, opts) => {
    fastify.register(fastifyJwt, {
        secret: jwtSecretKey
    });
    
    fastify.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await request.jwtVerify();
        }
        catch (e) {
            reply.send(e);
        }
    });

    fastify.decorate('authorizeRoles', function (roles: string[]) {
        return async function (request: FastifyRequest, reply: FastifyReply) {
            const user = request.user as { role?: string };
            if (!user || !roles.includes(user.role || '')) {
                return reply.status(403).send({ error: 'ERROR: you do not have permission to access this endpoint!'});
            }
        };
    });
});