import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { auth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";

export const createGroup = async (app: FastifyInstance) => {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/groups",
			{
				schema: {
					summary: "Create a new group(authenticated)",
					body: z.object({
						name: z.string(),
						description: z.string(),
						adminId: z.uuid(),
					}),
					headers: z.object({
						authorization: z.string(),
					}),
					response: {
						201: z.object({
							id: z.uuid(),
							name: z.string(),
							description: z.string().nullable(),
							adminId: z.uuid(),
						}),
						400: z.object({
							message: z.string(),
						}),
					},
				},
			},
			async (request, reply) => {
				const { name, description, adminId } = request.body;
				const admin = await prisma.user.findUnique({
					where: {
						id: adminId,
					},
				});
				if (!admin) {
					return reply.code(400).send({ message: "admin from group don't exists" });
				}
				const group = await prisma.group.create({
					data: {
						name,
						description,
						adminId,
					},
				});
				return reply.code(201).send(group);
			},
		);
};
