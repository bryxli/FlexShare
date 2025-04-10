/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { User } from "@FlexShare/core/user";
import { updateByUserId } from "../../src/user";

vi.mock("@FlexShare/core/user", () => ({
  User: {
    updateByUserId: vi.fn(),
  },
}));

const mockEvent: APIGatewayProxyEventV2 = {} as APIGatewayProxyEventV2;
const mockContext: Context = {} as Context;

describe("User updateByUserId API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and response body when User.updateByUserId succeeds", async () => {
    const mockResponse = { user_id: "testuser" };
    (User.updateByUserId as any).mockResolvedValue(mockResponse);

    const result = await updateByUserId(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockResponse));
    expect(User.updateByUserId).toHaveBeenCalled();
  });

  it("should return 500 and error message when User.updateByUserId throws", async () => {
    (User.updateByUserId as any).mockRejectedValue(
      new Error("Invalid user_id"),
    );

    const result = await updateByUserId(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: "Invalid user_id" }));
    expect(User.updateByUserId).toHaveBeenCalled();
  });

  it("should return 500 with generic error when thrown error is not an instance of Error", async () => {
    (User.updateByUserId as any).mockRejectedValue("Non-error object");

    const result = await updateByUserId(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ error: "Internal Server Error" }),
    );
    expect(User.updateByUserId).toHaveBeenCalled();
  });
});
