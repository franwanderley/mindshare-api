import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const deleteIdeas = async (app: FastifyInstance) => {
   app.withTypeProvider<ZodTypeProvider>().register(auth).delete("/ideas/:id", {
      schema: {
        summary: 'Delete a idea if you are the author or group admin',
        params: z.object({
          id: z.string(),
        }),
        headers: z.object({
          authorization: z.string(),
        })
      },
   }, async (request, reply) => {
    const { id } = request.params;
    const { sub } = z.object({ sub: z.string() }).parse(request.user);

    const idea = await prisma.idea.findUnique({
      where: {
        id,
      },
      include: {
        group: true,
      },
    });
    if (!idea) {
      return reply.status(400).send({ error: 'Idea not found' });
    }
    if (idea.authorId !== sub && idea.group.adminId !== sub) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    await prisma.idea.delete({
      where: {
        id,
      },
    });
    return reply.status(204).send();
   });
};