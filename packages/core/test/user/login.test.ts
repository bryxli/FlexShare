import { describe, it, expect, vi, beforeEach } from "vitest";

import { login } from "../../src/user";
import * as dynamo from "../../src/utils/dynamo";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

const mockAuthenticate = vi.spyOn(dynamo, "authenticate");
const mockUser = { user_id: "testuser" };

describe("login", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should login to created user successfully", async () => {
    mockAuthenticate.mockResolvedValue({
      $metadata: {
        httpStatusCode: 200,
      },
      Item: mockUser,
    });

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    const user = await login(event);

    expect(user).toEqual(mockUser);
  });

  it("should throw an error if body is missing", async () => {
    const event = {} as APIGatewayProxyEventV2;

    await expect(() => login(event)).rejects.toThrow("Missing request body");
  });

  it("should throw an error when login fails", async () => {
    mockAuthenticate.mockResolvedValue({
      $metadata: {
        httpStatusCode: 500,
      },
    });

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    try {
      await login(event);
    } catch (e: unknown) {
      if (e instanceof Error) {
        expect(e.message).toMatch(/Error occured while logging in/);
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

    await expect(() => login(event)).rejects.toThrow("Unknown error occurred");

    JSON.parse = originalParse;
  });
});
