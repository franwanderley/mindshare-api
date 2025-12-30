import type { 
   FastifyInstance, 
   FastifyRequest, 
   FastifyReply } 
from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export const decorateAuth = (app: FastifyInstance) => {
	app
		.withTypeProvider<ZodTypeProvider>()
		.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch (err) {
				reply.send(err);
			}
		});
};
declare module "fastify" {
	export interface FastifyInstance {
		authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}
}
