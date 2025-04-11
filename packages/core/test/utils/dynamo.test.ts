import { describe, it, expect } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import {
  DeleteCommand,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  PutCommandOutput,
} from "@aws-sdk/lib-dynamodb";

import {
  authenticate,
  checkUserExists,
  deleteUser,
  getUser,
  updateUser,
} from "../../src/utils/dynamo";

const client = mockClient(DynamoDBDocumentClient);
const mockUser = { user_id: "testid" };

describe("getUser", () => {
  it("should return the item upon succesful retrieval", async () => {
    const getCommandOutput: GetCommandOutput = {
      $metadata: {},
      Item: {},
    };

    client.on(GetCommand).callsFake(() => {
      return getCommandOutput;
    });

    const result = await getUser(mockUser.user_id);
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

    const result = await checkUserExists(mockUser.user_id);
    expect(result).toBe(true);
  });

  it("should return false if user does not exist in users table", async () => {
    client.on(GetCommand).callsFake(() => {
      return {
        Item: undefined,
      };
    });

    const result = await checkUserExists(mockUser.user_id);
    expect(result).toBe(false);
  });
});

describe("deleteUser", () => {
  it("should return the response upon succesful retrieval", async () => {
    const deleteCommandOutput: DeleteCommandOutput = {
      $metadata: {},
    };

    client.on(DeleteCommand).callsFake(() => {
      return deleteCommandOutput;
    });

    const result = await deleteUser(mockUser.user_id);
    expect(result).toBeDefined();
  });
});

describe("authenticate", () => {
  it("should return the user upon successful authentication", async () => {
    const getCommandOutput: GetCommandOutput = {
      $metadata: {},
      Item: {},
    };

    client.on(GetCommand).callsFake(() => {
      return getCommandOutput;
    });

    const result = await authenticate(mockUser);
    expect(result).toBeDefined();
  });

  it("should throw Error upon unsuccessful authentication", async () => {
    const getCommandOutput: GetCommandOutput = {
      $metadata: {},
    };
    const mockError = new Error("Invalid login");

    client.on(GetCommand).callsFake(() => {
      return getCommandOutput;
    });

    try {
      await authenticate(mockUser);
    } catch (e) {
      expect(e).toStrictEqual(mockError);
    }
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
