export * as User from "./user";

import { z } from "zod";

import { checkUserExists, updateUser } from "./utils/dynamo";
import { User } from "./utils/types";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

const RegisterSchema = z.object({
  user_id: z.string(),
});

/**
 * Registers a new user by checking if the user exists and then creating
 * or updating their record in the database.
 *
 * This function performs the following steps:
 * 1. Parses the incoming request body.
 * 2. Validates the body using the `RegisterSchema`.
 * 3. Checks if the user already exists in the database.
 * 4. If the user doesn't exist, updates the DynamoDB table with the new user.
 * 5. Returns the user object if registration is successful or throws an error.
 *
 * @param event - The API Gateway event object containing the request body.
 * @returns The user object if registration is successful.
 * @throws Error if validation fails or if a user with the same `user_id` already exists.
 */
export async function register(event: APIGatewayProxyEventV2) {
  const body = event.body;

  if (!body) {
    throw new Error("Missing request body");
  }

  try {
    const parsed = JSON.parse(body);
    const schema = RegisterSchema.parse(parsed);

    const user: User = {
      user_id: schema.user_id,
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
      throw new Error(`Parsing/validation error: ${e.message}`);
    } else {
      throw new Error("Unknown error occurred during parsing/validation");
    }
  }
}
