/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { User } from "@FlexShare/core/user";
import { update } from "../../src/user";

vi.mock("@FlexShare/core/user", () => ({
  User: {
    update: vi.fn(),
  },
}));

const mockEvent: APIGatewayProxyEventV2 = {} as APIGatewayProxyEventV2;
const mockContext: Context = {} as Context;

describe("User update API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and response body when User.update succeeds", async () => {
    const mockResponse = { user_id: "testuser" };
    (User.update as any).mockResolvedValue(mockResponse);

    const result = await update(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockResponse));
    expect(User.update).toHaveBeenCalled();
  });

  it("should return 500 and error message when User.update throws", async () => {
    (User.update as any).mockRejectedValue(new Error("Invalid user_id"));

    const result = await update(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: "Invalid user_id" }));
    expect(User.update).toHaveBeenCalled();
  });

  it("should return 500 with generic error when thrown error is not an instance of Error", async () => {
    (User.update as any).mockRejectedValue("Non-error object");

    const result = await update(mockEvent, mockContext);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ error: "Internal Server Error" }),
    );
    expect(User.update).toHaveBeenCalled();
  });
});
