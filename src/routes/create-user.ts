import bcript from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";

export const createUser = async (app: FastifyInstance) => {
   app.withTypeProvider<ZodTypeProvider>().post("/users", {
      schema: {
        summary: 'Create a new user',
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string().min(8),
        }),
        response: {
          201: z.object({
            id: z.uuid(),
            name: z.string(),
            email: z.email(),
            password: z.string().min(8),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
   },
   async (request, reply) => {
      const { name, email, password } = request.body;
      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (userExists) {
        return reply.code(400).send({ message: 'User already exists' });
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: bcript.hashSync(password, 8),
        },
      });
      reply.code(201).send(user);
   });
};