import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";

export const findUsersByGroup = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/groups/:groupId/users",
    {
      schema: {
        summary: "Find all users by group",
        params: z.object({
          groupId: z.uuid(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.uuid(),
              name: z.string(),
              email: z.email(),
              password: z.string().min(8),
              role: z.string(),
            }),
          ),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { groupId } = request.params;
      const group = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
      });
      if (!group) {
        return reply.status(400).send({ message: "Group not found" });
      }
      const usersWithRole = await prisma.$queryRaw<
        {
          id: string;
          name: string;
          email: string;
          password: string;
          role: string;
        }[]
      >`
      SELECT u.id, u.name, u.email, u.password, gm.role
      FROM "User" u
      JOIN "GroupMember" gm ON u.id = gm."userId"
      WHERE gm."groupId" = ${groupId}
    `;
      reply.code(200).send(usersWithRole);
    },
  );
};
