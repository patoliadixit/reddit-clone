import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entity/User";
import argon2 from "argon2";
@Resolver()
export class UserResolver {
  @Query(() => [User])
  async allUsers() {
    return User.find();
  }
  @Mutation(() => ID)
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
}
