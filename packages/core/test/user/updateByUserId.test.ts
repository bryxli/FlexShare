import { describe, it, expect, vi, beforeEach } from "vitest";

import { updateByUserId } from "../../src/user";
import * as dynamo from "../../src/utils/dynamo";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

const mockUpdateUser = vi.spyOn(dynamo, "updateUser");
const mockGetUser = vi.spyOn(dynamo, "getUser");
const mockUser = { user_id: "testuser" };

describe("updateByUserId", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should update user successfully", async () => {
    mockUpdateUser.mockResolvedValue({
      $metadata: {
        httpStatusCode: 200,
      },
    });

    mockGetUser.mockResolvedValue({
      $metadata: {
        httpStatusCode: 200,
      },
      Item: mockUser,
    });

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    const user = await updateByUserId(event);

    expect(user).toEqual(mockUser);
  });

  it("should throw an error if body is missing", async () => {
    const event = {} as APIGatewayProxyEventV2;

    await expect(() => updateByUserId(event)).rejects.toThrow(
      "Missing request body",
    );
  });

  it("should throw an error when update fails", async () => {
    mockUpdateUser.mockResolvedValue({
      $metadata: {
        httpStatusCode: 500,
      },
    });

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    try {
      await updateByUserId(event);
    } catch (e: unknown) {
      if (e instanceof Error) {
        expect(e.message).toMatch(/Error occured while updating/);
      } else {
        throw new Error("Expected an Error to be thrown");
      }
    }
  });

  it("should throw an unknown error if a non-Error is thrown", async () => {
    const originalParse = JSON.parse;
    JSON.parse = () => {
      throw "non-error value";
    };

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    await expect(() => updateByUserId(event)).rejects.toThrow(
      "Unknown error occurred",
    );

    JSON.parse = originalParse;
  });
});
