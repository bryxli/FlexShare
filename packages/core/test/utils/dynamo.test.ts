import { describe, it, expect } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  PutCommandOutput,
} from "@aws-sdk/lib-dynamodb";

import { checkUserExists, getUser, updateUser } from "../../src/utils/dynamo";

const client = mockClient(DynamoDBDocumentClient);
const mockUser = { user_id: "testid" };

describe("getUser", () => {
  it("should return the response upon succesful retrieval", async () => {
    const getCommandOutput: GetCommandOutput = {
      $metadata: {},
    };

    client.on(GetCommand).callsFake(() => {
      return getCommandOutput;
    });

    const result = await getUser(mockUser);
    expect(result).toBeDefined();
  });
});

describe("checkUserExists", () => {
  beforeEach(() => {
    client.reset();
  });

  it("should return true if user exists in users table", async () => {
    client.on(GetCommand).callsFake(() => {
      return {
        Item: mockUser,
      };
    });

    const result = await checkUserExists(mockUser);
    expect(result).toBe(true);
  });

  it("should return false if user does not exist in users table", async () => {
    client.on(GetCommand).callsFake(() => {
      return {
        Item: undefined,
      };
    });

    const result = await checkUserExists(mockUser);
    expect(result).toBe(false);
  });
});

describe("updateUser", () => {
  it("should return the response upon succesful update", async () => {
    const putCommandOutput: PutCommandOutput = {
      $metadata: {},
    };

    client.on(PutCommand).callsFake(() => {
      return putCommandOutput;
    });

    const result = await updateUser(mockUser);
    expect(result).toBeDefined();
  });
});
