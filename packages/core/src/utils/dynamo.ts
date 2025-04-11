import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import type { User } from "./types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Gets a user from the DynamoDB table.
 *
 * This function queries the `users` table for an item with the given `user_id`.
 *
 * @param user_id - A `string` containing the `user_id` to search for.
 * @returns The result of the `GetCommand` operation.
 */
export async function getUser(user_id: string) {
  const res = await docClient.send(
    new GetCommand({
      /* TODO: dev | prod */
      TableName: "dev-FlexShare-users",
      Key: { user_id },
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
 * @param user_id - A `string` containing the `user_id` to search for.
 * @returns `true` if the user exists, `false` otherwise.
 */
export async function checkUserExists(user_id: string) {
  const res = await getUser(user_id);

  return Boolean(res.Item);
}

/**
 * Deletes a user record in the DynamoDB table.
 *
 * @param user_id - A `string` containing the `user_id` to delete.
 * @returns The result of the `DeleteCommand` operation.
 */
export async function deleteUser(user_id: string) {
  const res = await docClient.send(
    new DeleteCommand({
      /* TODO: dev | prod */
      TableName: "dev-FlexShare-users",
      Key: { user_id },
    }),
  );

  return res;
}

/**
 * Authenticates a user.
 *
 * @param user - A `User` object containing the authentication information.
 * @returns the result of `getUser`
 * @throws Error if authentication fails.
 */
export async function authenticate(user: User) {
  const res = await getUser(user.user_id);

  /* TODO: authenticate using res and user */

  if (!(await checkUserExists(user.user_id))) {
    throw new Error("Invalid login");
  }

  return res;
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
