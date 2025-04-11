import { describe, it, expect, vi, beforeEach } from "vitest";

import { deleteByUserId } from "../../src/user";
import * as dynamo from "../../src/utils/dynamo";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

const mockDeleteUser = vi.spyOn(dynamo, "deleteUser");
const mockUser = { user_id: "testuser" };

describe("deleteByUserId", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should delete user object successfully", async () => {
    const event = {
      rawPath: "/test/testuser",
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    const res = await deleteByUserId(event);

    expect(res.$metadata.httpStatusCode).toBe(200);
  });

  it("should throw an error when delete fails", async () => {
    mockDeleteUser.mockResolvedValue({
      $metadata: {
        httpStatusCode: 500,
      },
    });

    const event = {
      rawPath: "/test/testuser",
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    try {
      await deleteByUserId(event);
    } catch (e: unknown) {
      if (e instanceof Error) {
        expect(e.message).toMatch(/Error occured while deleting/);
      } else {
        throw new Error("Expected an Error to be thrown");
      }
    }
  });

  //   it("should throw an unknown error if a non-Error is thrown", async () => {
  //     const originalParse = JSON.parse;
  //     JSON.parse = () => {
  //       throw "non-error value";
  //     };

  //     const event = {
  //         rawPath: "/test/testuser",
  //       body: JSON.stringify(mockUser),
  //     } as APIGatewayProxyEventV2;

  //     await expect(() => deleteByUserId(event)).rejects.toThrow(
  //           "Unknown error occurred",
  //         );

  //     JSON.parse = originalParse;
  //   });
});
