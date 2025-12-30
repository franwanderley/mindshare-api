import fastifyCors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createUser } from "./routes/create-user";
import { findAllUsers } from "./routes/find-all-user";
import { decorateAuth } from "./decorators/auth";
import { createGroup } from "./routes/group/create-group";
import { loginUser } from "./routes/auth/login";

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
app.register(findAllUsers);
app.register(loginUser);
//app.register(createGroup);

app.register(jwt, {
  secret: 'my-jwt-secret',
})
app.register(decorateAuth);

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	console.log(`Server listening on ${address}`);
});

export default app;
