import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { auth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

export const findAllGroup = async (app: FastifyInstance) => {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/groups",
			{
				schema: {
					summary: "Get all groups",
					response: {
						200: z.array(
							z.object({
								id: z.uuid(),
								name: z.string(),
								description: z.string().nullable(),
								adminId: z.string(),
								createdAt: z.date(),
								members: z.array(
									z.object({
										id: z.uuid(),
										role: z.enum(["ADMIN", "MEMBER"]),
										userId: z.uuid(),
										groupId: z.uuid(),
									}),
								),
							}),
						),
					},
				},
			},
			async (_, reply) => {
				const groups = await prisma.group.findMany({
					include: {
						members: true,
					},
				});
				return reply.status(200).send(groups);
			},
		);
};
