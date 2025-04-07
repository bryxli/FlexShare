export * as User from "./user";

import { z } from "zod";

import { checkUserExists, updateUser } from "./utils/dynamo";
import { User } from "./utils/types";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

const RegisterSchema = z.object({
  username: z.string(),
});

export async function register(event: APIGatewayProxyEventV2) {
  const body = event.body;

  if (!body) {
    throw new Error("Missing request body");
  }

  try {
    const parsed = JSON.parse(body);
    const schema = RegisterSchema.parse(parsed);

    const user: User = {
      user_id: schema.username,
    };

    const userExists = await checkUserExists(user);
    if (userExists) {
      throw new Error("Username already exists");
    }

    const res = await updateUser(user);

    if (res.$metadata.httpStatusCode === 200) {
      return user;
    } else {
      throw new Error(`Error occured while registering: ${res}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Parsing / validation error: ${e.message}`);
    } else {
      throw new Error("Unknown error occurred during parsing/validation");
    }
  }
}
