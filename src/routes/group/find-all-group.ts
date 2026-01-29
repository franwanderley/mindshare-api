import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";

export const findAllGroup = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/groups",
      {
        schema: {
          summary: "Find all groups(authenticated)",
          headers: z.object({
            authorization: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
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
            ),
          },
        },
      },
      async (_, reply) => {
        const groups = await prisma.group.findMany({
          include: {
            members: true,
          },
        });
        return reply.status(200).send(groups);
      },
    );
};
