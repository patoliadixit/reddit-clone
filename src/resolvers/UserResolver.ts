import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entity/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
@Resolver()
export class UserResolver {
  @Query(() => [User])
  async allUsers() {
    return User.find();
  }
  @Mutation(() => String)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Arg("email") email: string
  ) {
    const user = await User.findOne({ username });
    if (user != undefined) {
      return new Error("username_exists");
    }
    const hash = await argon2.hash(password);
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = hash;
    let userData = await User.save(newUser);
    return userData.id;
  }
  @Mutation(() => String)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string
  ) {
    let property = "username";
    if (usernameOrEmail.includes("@")) {
      property = "email";
    }
    let user = await User.findOne({ [property]: usernameOrEmail });
    if (!user) {
      throw new Error("no_user_found");
    }
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      throw new Error("wrong_password");
    }
    const payload = {
      user: {
        username: user.username,
      },
    };
    let token = jwt.sign(payload, process.env.SECRET_KEY);
    return token;
  }
}
