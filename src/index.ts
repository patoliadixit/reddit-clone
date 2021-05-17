import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolver";
import { ApolloServer } from "apollo-server-express";
createConnection().then(async (connection) => {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000);
});
