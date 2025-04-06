export * as User from "./user";

import crypto from "crypto";
import { z } from "zod";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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

    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const user = {
      user_id: crypto.randomUUID(),
      username: schema.username,
    };

    const command = new PutCommand({
      /* TODO: dev | prod */
      TableName: "dev-FlexShare-users",
      Item: user,
    });

    const res = await docClient.send(command);

    if (res.$metadata.httpStatusCode === 200) {
      return user;
    } else {
      throw new Error(`Error occured while registering: ${res}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Invalid JSON or validation error: ${e.message}`);
    } else {
      throw new Error("Unknown error occurred during parsing/validation");
    }
  }
}
