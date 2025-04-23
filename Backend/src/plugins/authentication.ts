import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async (fastify, opts) => {
    fastify.register(fastifyJwt, {
        secret: 'supersecret'
    });
    
    fastify.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await request.jwtVerify();
        }
        catch (e) {
            reply.send(e);
        }
    });

});