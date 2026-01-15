import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { auth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";

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
				const invites = await prisma.groupInvitation.findMany({
					where: {
						receiverId: userId,
					},
				});
				return reply.code(200).send(invites);
			},
		);
};
