import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";

export const findByIdGroup = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/groups/:id",
      {
        schema: {
          summary: "Find group by ID(authenticated)",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
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
            400: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const group = await prisma.group.findUnique({
          include: {
            members: true,
          },
          where: {
            id: request.params.id
          },
        });
        if (!group) {
          return reply.status(400).send({ error: "Group not found" });
        }
        return reply.status(200).send(group);
      },
    );
};
