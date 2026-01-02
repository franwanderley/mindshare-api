import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook("preHandler", async (request) => {
		await request.jwtVerify<{ sub: string }>();
	});
});
