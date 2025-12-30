import bcript from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";

export const loginUser = async (app: FastifyInstance) => {
   app.withTypeProvider<ZodTypeProvider>().post("/login", {
      schema: {
        summary: 'Login a user',
         body: z.object({
          email: z.email(),
          password: z.string().min(8),
        }),
         response: {
          200: z.object({
            token: z.string(),
            }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
   }, async (request, reply) => {
      const { email, password } = request.body;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return reply.code(401).send({ message: 'User not found' });
      }
      const isPasswordValid = bcript.compareSync(password, user.password);
      if (!isPasswordValid) {
        return reply.code(401).send({ message: 'Invalid password' });
      }
      const token = app.jwt.sign({
        sub: user.id,
      });
      reply.code(200).send({ token });
   });

};