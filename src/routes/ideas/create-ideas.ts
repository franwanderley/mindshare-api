import z from "zod";
import { auth } from "@/middlewares/auth";
import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export const createIdeas = async (app: FastifyInstance) => {
   app.withTypeProvider<ZodTypeProvider>().register(auth).post("/ideas", {
      schema: {
        summary: 'Create a new idea',
        body: z.object({
          title: z.string(),
          description: z.string(),
          authorId: z.string(),
          groupId: z.string(),
        })
      },
   }, async (request, reply) => {
      const { title, description, authorId, groupId } = request.body;
      const group = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
        include: {
          members: true,
        },
      });
      if (!group) {
        return reply.status(400).send({ error: 'Group not found' });
      }

      const author = await prisma.user.findUnique({
        where: {
          id: authorId,
        },
      });
      if (!author) {
        return reply.status(400).send({ error: 'Author not found' });
      }
      if (group.members.some((member) => member.id === authorId)) {
        return reply.status(400).send({ error: 'User is not a member of the group' });
      }
      const idea = await prisma.idea.create({
        data: {
          title,
          description,
          authorId,
          groupId,
        },
      });
      return reply.status(201).send(idea);
   
      
   });
};