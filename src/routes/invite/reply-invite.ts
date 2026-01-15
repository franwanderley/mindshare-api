import { prisma } from "@/lib/prisma";
import { auth } from "@/middlewares/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const replyInvite = async (app: FastifyInstance) => {
   app.withTypeProvider<ZodTypeProvider>().register(auth).put("/invites/:inviteId", {
      schema: {
         summary: "Reply to an invite",
         body: z.object({
            status: z.enum(["ACCEPTED", "DECLINED"]),
         }),
         params: z.object({
            inviteId: z.string(),
         }),
      }
   }, async (request, reply) => {
      const { inviteId } = request.params;
      const { status } = request.body;
      const invite = await prisma.groupInvitation.findUnique({
         where: {
            id: inviteId,
         },
      });
      if (!invite) {
         return reply.code(400).send({ message: "Invite not found" });
      }
      await prisma.groupInvitation.update({
         where: {
            id: inviteId,
         },
         data: {
            status,
         },
      });
      if (status === "ACCEPTED") {
         await prisma.groupMember.create({
            data: {
               groupId: invite.groupId,
               userId: invite.receiverId,
            },
         });
      }
      return reply.code(204).send();
   });
};