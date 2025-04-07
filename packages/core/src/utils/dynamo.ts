import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { User } from "./types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function checkUserExists(user: User) {
  const existing = await docClient.send(
    new GetCommand({
      /* TODO: dev | prod */
      TableName: "dev-FlexShare-users",
      Key: { user_id: user.user_id },
    }),
  );

  return existing.Item;
}

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
