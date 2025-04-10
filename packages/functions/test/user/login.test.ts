/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { User } from "@FlexShare/core/user";
import { login } from "../../src/user";

vi.mock("@FlexShare/core/user", () => ({
  User: {
    login: vi.fn(),
  },
}));

const mockEvent: APIGatewayProxyEventV2 = {} as APIGatewayProxyEventV2;
const mockContext: Context = {} as Context;

describe("User login API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and response body when User.login succeeds", async () => {
    const mockResponse = { user_id: "testuser" };
    (User.login as any).mockResolvedValue(mockResponse);

    const result = await login(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockResponse));
    expect(User.login).toHaveBeenCalled();
  });

  it("should return 500 and error message when User.login throws", async () => {
    (User.login as any).mockRejectedValue(new Error("Invalid login"));

    const result = await login(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: "Invalid login" }));
    expect(User.login).toHaveBeenCalled();
  });

  it("should return 500 with generic error when thrown error is not an instance of Error", async () => {
    (User.login as any).mockRejectedValue("Non-error object");

    const result = await login(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ error: "Internal Server Error" }),
    );
    expect(User.login).toHaveBeenCalled();
  });
});
