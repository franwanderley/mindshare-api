import { auth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const deleteGroup = async (app: FastifyInstance) => {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete(
			"/groups/:id",
			{
				schema: {
					summary: "Delete a group(authenticated)",
					params: z.object({
						id: z.string(),
					}),
					headers: z.object({
						authorization: z.string(),
					}),
				},
			},
			async (request, reply) => {
            const { sub } = request.user as { sub: string };
            const group = await prisma.group.findUnique({
               where: {
                  id: request.params.id,
               },
            });
            if (!group) {
               return reply.status(400).send({ message: "Group not found" });
            }
            if (group.adminId !== sub) {
               return reply.status(401).send({ message: "Unauthorized" });
            }

            await prisma.$transaction([
               prisma.groupMember.deleteMany({
                  where: { groupId: request.params.id },
               }),
               prisma.groupInvitation.deleteMany({
                  where: { groupId: request.params.id },
               }),
               prisma.idea.deleteMany({
                  where: { groupId: request.params.id },
               }),
               prisma.group.delete({
                  where: {
                     id: request.params.id,
                  },
               }),
            ]);
            return reply.status(204).send();
			},
		);
};
