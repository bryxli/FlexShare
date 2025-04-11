/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { User } from "@FlexShare/core/user";
import { retrieveByUserId } from "../../src/user";

vi.mock("@FlexShare/core/user", () => ({
  User: {
    retrieveByUserId: vi.fn(),
  },
}));

const mockEvent: APIGatewayProxyEventV2 = {} as APIGatewayProxyEventV2;
const mockContext: Context = {} as Context;

describe("User retrieveByUserId API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and response body when User.retrieveByUserId succeeds", async () => {
    const mockResponse = { user_id: "testuser" };
    (User.retrieveByUserId as any).mockResolvedValue(mockResponse);

    const result = await retrieveByUserId(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockResponse));
    expect(User.retrieveByUserId).toHaveBeenCalled();
  });

  it("should return 500 and error message when User.retrieveByUserId throws", async () => {
    (User.retrieveByUserId as any).mockRejectedValue(
      new Error("Invalid user_id"),
    );

    const result = await retrieveByUserId(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: "Invalid user_id" }));
    expect(User.retrieveByUserId).toHaveBeenCalled();
  });

  it("should return 500 with generic error when thrown error is not an instance of Error", async () => {
    (User.retrieveByUserId as any).mockRejectedValue("Non-error object");

    const result = await retrieveByUserId(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ error: "Internal Server Error" }),
    );
    expect(User.retrieveByUserId).toHaveBeenCalled();
  });
});
