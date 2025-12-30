import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const createGroup = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/groups",
		{
			onRequest: [app.authenticate],
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
         console.log(`Creating group: ${name} - ${description}`);
      });
};
