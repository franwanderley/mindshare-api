import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { auth } from "@/middlewares/auth";

export const createGroup = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().register(auth).post(
		"/groups",
		{
			schema: {
            summary: "Create a new group(authenticated)",
            body: z.object({
              name: z.string(),
              description: z.string(),
            }),
            headers: z.object({
              authorization: z.string(),
            }),
         },
		},
		async (request, reply) => {
         const { name, description } = request.body;
         request.log.info(`Creating group: ${name} - ${description}`);
      });
};
