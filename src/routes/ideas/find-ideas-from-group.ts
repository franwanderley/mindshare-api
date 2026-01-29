import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";

export const findIdeasFromGroup = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/ideas/:groupId",
      {
        schema: {
          summary: "find all ideas from a group(authenticate)",
          params: z.object({
            groupId: z.string(),
          }),
          headers: z.object({
            authorization: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                description: z.string(),
                authorId: z.string(),
                groupId: z.string(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const { groupId } = request.params;
        const ideas = await prisma.idea.findMany({
          where: {
            groupId,
          },
        });
        return reply.status(200).send(ideas);
      },
    );
};
