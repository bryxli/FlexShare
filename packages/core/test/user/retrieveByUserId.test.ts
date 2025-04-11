import { describe, it, expect, vi, beforeEach } from "vitest";

import { retrieveByUserId } from "../../src/user";
import * as dynamo from "../../src/utils/dynamo";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

const mockGetUser = vi.spyOn(dynamo, "getUser");
const mockUser = { user_id: "testuser" };

describe("retrieveByUserId", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should retrieve user object successfully", async () => {
    mockGetUser.mockResolvedValue({
      $metadata: {
        httpStatusCode: 200,
      },
      Item: mockUser,
    });

    const event = {
      rawPath: "/test/testuser",
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    const user = await retrieveByUserId(event);

    expect(user).toEqual(mockUser);
  });

  it("should throw an error when retrieval fails", async () => {
    mockGetUser.mockResolvedValue({
      $metadata: {
        httpStatusCode: 500,
      },
    });

    const event = {
      rawPath: "/test/testuser",
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    try {
      await retrieveByUserId(event);
    } catch (e: unknown) {
      if (e instanceof Error) {
        expect(e.message).toMatch(/Error occured while retrieving/);
      } else {
        throw new Error("Expected an Error to be thrown");
      }
    }
  });

  // it("should throw an unknown error if a non-Error is thrown", async () => {
  //   const originalParse = JSON.parse;
  //   JSON.parse = () => {
  //     throw "non-error value";
  //   };

  //   const event = {
  //       rawPath: "/test/testuser",
  //     body: JSON.stringify(mockUser),
  //   } as APIGatewayProxyEventV2;

  //   await expect(() => retrieveByUserId(event)).rejects.toThrow(
  //         "Unknown error occurred",
  //       );

  //   JSON.parse = originalParse;
  // });
});
