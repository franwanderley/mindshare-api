import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { auth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";

export const inviteUser = async (app: FastifyInstance) => {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/invites",
			{
				schema: {
					summary: "Invite a user to a group(authenticated)",
					body: z.object({
						groupId: z.uuid(),
						senderId: z.uuid(),
						receiverId: z.uuid(),
					}),
					headers: z.object({
						authorization: z.string(),
					}),
					response: {
						201: z.object({
							id: z.uuid(),
							groupId: z.uuid(),
							senderId: z.uuid(),
							receiverId: z.uuid(),
							status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
						}),
						400: z.object({
							message: z.string(),
						}),
					},
				},
			},
			async (request, reply) => {
				const { groupId, senderId, receiverId } = request.body;
				const group = await prisma.group.findUnique({
					where: {
						id: groupId,
					},
				});

            if (!group) {
                return reply.code(400).send({ message: "Group not found" });
            }
            if (group.adminId !== senderId) {
                  return reply.code(400).send({ message: "Only group admin can send invites" });
            }
				const invite = await prisma.groupInvitation.create({
               data: {
                  groupId,
                  senderId,
                  receiverId,
               },
            });
            return reply.code(201).send(invite);
			},
		);
};
