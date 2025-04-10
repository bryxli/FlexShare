import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { User } from "./types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Gets a user from the DynamoDB table.
 *
 * This function queries the `users` table for an item with the given `user_id`.
 *
 * @param user - A `User` object containing the `user_id` to search for.
 * @returns The result of the `GetCommand` operation.
 */
export async function getUser(user: User) {
  const res = await docClient.send(
    new GetCommand({
      /* TODO: dev | prod */
      TableName: "dev-FlexShare-users",
      Key: { user_id: user.user_id },
    }),
  );

  return res;
}

/**
 * Checks if a user already exists in the DynamoDB table.
 *
 * This function queries the `users` table for an item with the given `user_id`.
 * It returns a boolean indicating whether the user record exists.
 *
 * @param user - A `User` object containing the `user_id` to search for.
 * @returns `true` if the user exists, `false` otherwise.
 */
export async function checkUserExists(user: User) {
  const res = await getUser(user);

  return Boolean(res.Item);
}

/**
 * Inserts or updates a user record in the DynamoDB table.
 *
 * This function writes the entire `User` object into the `users` table.
 * If a record with the same `user_id` already exists, it will be replaced.
 *
 * @param user - A `User` object containing the data to store.
 * @returns The result of the `PutCommand` operation.
 */
export async function updateUser(user: User) {
  const res = await docClient.send(
    new PutCommand({
      /* TODO: dev | prod */
      TableName: "dev-FlexShare-users",
      Item: user,
    }),
  );

  return res;
}
