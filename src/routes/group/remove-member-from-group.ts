import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";

export const removeMemberFromGroup = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      "/groups/:groupId/members/:memberId",
      {
        schema: {
          summary: "Remove a member from a group(authenticated)",
          params: z.object({
            groupId: z.string(),
            memberId: z.string(),
          }),
          headers: z.object({
            authorization: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { groupId, memberId } = request.params;
        const { sub } = z.object({ sub: z.string() }).parse(request.user);

        const group = await prisma.group.findUnique({
          where: {
            id: groupId,
          },
          include: {
            members: true,
          },
        });
        if (!group) {
          return reply.status(400).send({ error: "Group not found" });
        }

        if (group.adminId !== sub) {
          return reply
            .status(400)
            .send({ error: "You are not the group admin" });
        }

        await prisma.groupMember.delete({
          where: {
            id: memberId,
          },
        });
        return reply.status(204).send();
      },
    );
};
