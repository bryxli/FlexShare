export * as User from "./user";

import { z } from "zod";

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
    const data = RegisterSchema.parse(parsed);

    /* TODO: validate unique username, add to DynamoDB */
    return data;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Invalid JSON or validation error: ${e.message}`);
    } else {
      throw new Error("Unknown error occurred during parsing/validation");
    }
  }
}
