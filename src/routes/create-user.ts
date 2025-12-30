import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

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
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
   },
   async (request, reply) => {
      const { name, email, password } = request.body;
      console.log(`Creating user: ${name}, ${email}`);
      reply.code(201).send({ message: "User created successfully" });
   });
};