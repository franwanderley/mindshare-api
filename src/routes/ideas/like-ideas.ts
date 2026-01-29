import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";

export const likeIdeas = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/ideas/:id/like",
      {
        schema: {
          summary: "Like an idea(authenticated)",
          params: z.object({
            id: z.string(),
          }),
          headers: z.object({
            authorization: z.string(),
          }),
        },
      },
      async (request, reply) => {
        const { id } = request.params;
        const { sub } = z.object({ sub: z.string() }).parse(request.user);

        const idea = await prisma.idea.findUnique({
          where: {
            id,
          },
        });
        if (!idea) {
          return reply.status(400).send({ error: "Idea not found" });
        }

        const group = await prisma.group.findUnique({
          where: {
            id: idea.groupId,
          },
          include: {
            members: true,
          },
        });
        if (!group) {
          return reply.status(400).send({ error: "Group not found" });
        }

        if (group.members.some((member) => member.id === sub)) {
          return reply
            .status(400)
            .send({ error: "User is not a member of the group" });
        }

        await prisma.like.create({
          data: {
            userId: sub,
            ideaId: id,
          },
        });
        return reply.status(204).send();
      },
    );
};
