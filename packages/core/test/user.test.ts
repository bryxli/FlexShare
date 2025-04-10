import { describe, it, expect, vi, beforeEach } from "vitest";

import { register } from "../src/user";
import * as dynamo from "../src/utils/dynamo";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

const mockCheckUserExists = vi.spyOn(dynamo, "checkUserExists");
const mockUpdateUser = vi.spyOn(dynamo, "updateUser");
const mockUser = { user_id: "testuser" };

describe("register", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should register a new user successfully", async () => {
    mockCheckUserExists.mockResolvedValue(false);
    mockUpdateUser.mockResolvedValue({ $metadata: { httpStatusCode: 200 } });

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    const user = await register(event);

    expect(user).toEqual(mockUser);
    expect(mockCheckUserExists).toHaveBeenCalledWith(mockUser);
    expect(mockUpdateUser).toHaveBeenCalledWith(mockUser);
  });

  it("should throw an error if body is missing", async () => {
    const event = {} as APIGatewayProxyEventV2;

    await expect(() => register(event)).rejects.toThrow("Missing request body");
  });

  it("should throw an error if username already exists", async () => {
    mockCheckUserExists.mockResolvedValue(true);

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    await expect(() => register(event)).rejects.toThrow(
      "Username already exists",
    );
  });

  it("should throw an error if updateUser fails", async () => {
    mockCheckUserExists.mockResolvedValue(false);
    mockUpdateUser.mockResolvedValue({ $metadata: { httpStatusCode: 500 } });

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    await expect(() => register(event)).rejects.toThrow(
      "Error occured while registering",
    );
  });

  it("should throw validation error for invalid input", async () => {
    const event = {
      body: JSON.stringify({ _user_id: "testuser" }),
    } as APIGatewayProxyEventV2;

    await expect(() => register(event)).rejects.toThrow(
      /Parsing\/validation error.*/,
    );
  });

  it("should throw an unknown error if a non-Error is thrown during parsing/validation", async () => {
    const originalParse = JSON.parse;
    JSON.parse = () => {
      throw "non-error value";
    };

    const event = {
      body: JSON.stringify(mockUser),
    } as APIGatewayProxyEventV2;

    await expect(() => register(event)).rejects.toThrow(
      "Unknown error occurred during parsing/validation",
    );

    JSON.parse = originalParse;
  });
});
