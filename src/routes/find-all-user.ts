import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";

export const findAllUsers = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/users",
		{
			schema: {
				summary: "Find all users",
				response: {
					200: z.array(
						z.object({
							id: z.uuid(),
							name: z.string(),
							email: z.email(),
							password: z.string().min(8),
						}),
					),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (_, reply) => {
			const users = await prisma.user.findMany();
			reply.code(200).send(users);
		},
	);
};
