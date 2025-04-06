import { ApiHandler } from "sst/node/api";
import { User } from "@FlexShare/core/user";

export const register = ApiHandler(async (_evt) => {
  try {
    const res = await User.register(_evt);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: e.message ?? "Internal Server Error" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  }
});
