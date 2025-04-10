/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { User } from "@FlexShare/core/user";
import { deleteByUserId } from "../../src/user";

vi.mock("@FlexShare/core/user", () => ({
  User: {
    deleteByUserId: vi.fn(),
  },
}));

const mockEvent: APIGatewayProxyEventV2 = {} as APIGatewayProxyEventV2;
const mockContext: Context = {} as Context;

describe("User deleteByUserId API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and response body when User.deleteByUserId succeeds", async () => {
    const mockResponse = { user_id: "testuser" };
    (User.deleteByUserId as any).mockResolvedValue(mockResponse);

    const result = await deleteByUserId(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockResponse));
    expect(User.deleteByUserId).toHaveBeenCalled();
  });

  it("should return 500 and error message when User.deleteByUserId throws", async () => {
    (User.deleteByUserId as any).mockRejectedValue(
      new Error("Invalid user_id"),
    );

    const result = await deleteByUserId(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: "Invalid user_id" }));
    expect(User.deleteByUserId).toHaveBeenCalled();
  });

  it("should return 500 with generic error when thrown error is not an instance of Error", async () => {
    (User.deleteByUserId as any).mockRejectedValue("Non-error object");

    const result = await deleteByUserId(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ error: "Internal Server Error" }),
    );
    expect(User.deleteByUserId).toHaveBeenCalled();
  });
});
