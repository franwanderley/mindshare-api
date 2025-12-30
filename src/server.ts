import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createUser } from "./routes/create-user";

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyCors, { 
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "MindShare API",
      description: "MindShare API",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform
});
app.register(ScalarApiReference, {
  routePrefix: "/docs",
})
app.register(createUser);

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	console.log(`Server listening on ${address}`);
});

export default app;
