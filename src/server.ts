import fastifyCors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { loginUser } from "./routes/auth/login";
import { createGroup } from "./routes/group/create-group";
import { deleteGroup } from "./routes/group/delete-group";
import { findAllGroup } from "./routes/group/find-all-group";
import { removeMemberFromGroup } from "./routes/group/remove-member-from-group";
import { createIdeas } from "./routes/ideas/create-ideas";
import { deleteIdeas } from "./routes/ideas/delete-ideas";
import { findIdeasFromGroup } from "./routes/ideas/find-ideas-from-group";
import { likeIdeas } from "./routes/ideas/like-ideas";
import { findInviteByUser } from "./routes/invite/find-invite-by-user";
import { inviteUser } from "./routes/invite/invite-user";
import { replyInvite } from "./routes/invite/reply-invite";
import { createUser } from "./routes/user/create-user";
import { findAllUsers } from "./routes/user/find-all-user";
import { findUsersByGroup } from "./routes/user/find-users-by-group";

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
  transform: jsonSchemaTransform,
});
app.register(ScalarApiReference, {
  routePrefix: "/docs",
});
app.register(jwt, {
  secret: "my-jwt-secret",
});
app.addHook("preHandler", (_req, _reply, next) => {
  return next();
});

app.register(findIdeasFromGroup);
app.register(findAllUsers);
app.register(findInviteByUser);
app.register(findAllGroup);
app.register(findUsersByGroup);
app.register(createUser);
app.register(createGroup);
app.register(createIdeas);
app.register(inviteUser);
app.register(likeIdeas);
app.register(loginUser);
app.register(replyInvite);
app.register(removeMemberFromGroup);
app.register(deleteGroup);
app.register(deleteIdeas);

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});

export default app;
