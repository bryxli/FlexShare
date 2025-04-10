/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@FlexShare/core/user", () => ({
  User: {
    register: vi.fn(),
  },
}));

import { User } from "@FlexShare/core/user";
import { register } from "../src/user";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";

const mockEvent: APIGatewayProxyEventV2 = {} as APIGatewayProxyEventV2;
const mockContext: Context = {} as Context;

describe("Register API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and response body when User.register succeeds", async () => {
    const mockResponse = { user_id: "testuser" };
    (User.register as any).mockResolvedValue(mockResponse);

    const result = await register(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockResponse));
    expect(User.register).toHaveBeenCalled();
  });

  it("should return 500 and error message when User.register throws", async () => {
    (User.register as any).mockRejectedValue(
      new Error("Username already exists"),
    );

    const result = await register(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ error: "Username already exists" }),
    );
    expect(User.register).toHaveBeenCalled();
  });

  it("should return 500 with generic error when thrown error is not an instance of Error", async () => {
    (User.register as any).mockRejectedValue("Non-error object");

    const result = await register(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ error: "Internal Server Error" }),
    );
    expect(User.register).toHaveBeenCalled();
  });
});
