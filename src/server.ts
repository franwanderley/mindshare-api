import fastifyCors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createUser } from "./routes/create-user";
import { findAllUsers } from "./routes/find-all-user";
import { createGroup } from "./routes/group/create-group";
import { loginUser } from "./routes/auth/login";
import { inviteUser } from "./routes/invite/invite-user";
import { findInviteByUser } from "./routes/invite/find-invite-by-user";
import { replyInvite } from "./routes/invite/reply-invite";
import { findAllGroup } from "./routes/group/find-all-group";
import { deleteGroup } from "./routes/group/delete-group";
import { createIdeas } from "./routes/ideas/create-ideas";

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
app.register(jwt, {
  secret: 'my-jwt-secret',
})
app.addHook('preHandler', (_req, _reply, next) => {
  return next()
})

app.register(createUser);
app.register(findAllUsers);
app.register(loginUser);
app.register(createGroup);
app.register(inviteUser);
app.register(findInviteByUser);
app.register(replyInvite);
app.register(findAllGroup);
app.register(deleteGroup);
app.register(createIdeas);

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	console.log(`Server listening on ${address}`);
});

export default app;
