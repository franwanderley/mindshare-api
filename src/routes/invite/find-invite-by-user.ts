import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";

export const findInviteByUser = async (app: FastifyInstance) => {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/invites/user/:userId",
			{
				schema: {
					summary: "Find all invites by user",
					params: z.object({
						userId: z.uuid(),
					}),
					headers: z.object({
						authorization: z.string(),
					}),
					querystring: z.object({
						status: z.optional(z.enum(["PENDING", "ACCEPTED", "DECLINED"])),
					}),
					response: {
						200: z.array(
							z.object({
								id: z.uuid(),
								groupId: z.uuid(),
								senderId: z.uuid(),
								receiverId: z.uuid(),
								status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
							}),
						),
					},
				},
			},
			async (request, reply) => {
				const { userId } = request.params;
				const { status } = request.query;
				const invites = await prisma.groupInvitation.findMany({
					where: {
						receiverId: userId,
						status,
					},
				});
				return reply.code(200).send(invites);
			},
		);
};
