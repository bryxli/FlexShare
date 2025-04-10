import { ApiHandler } from "sst/node/api";
import { User } from "@FlexShare/core/user";

/**
 * User registration endpoint.
 *
 * Calls the core `User.register` function and returns the result.
 * Returns a 500 error if registration fails.
 */
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

/**
 * User login endpoint.
 *
 * Calls the core `User.login` function and returns the result.
 * Returns a 500 error if login fails.
 */
export const login = ApiHandler(async (_evt) => {
  try {
    const res = await User.login(_evt);

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

/**
 * User retrieval endpoint.
 *
 * Calls the core `User.retrieve` function and returns the result.
 * Returns a 500 error if retrieve fails.
 */
export const retrieveByUserId = ApiHandler(async (_evt) => {
  try {
    const res = await User.retrieveByUserId(_evt);

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

/**
 * User update endpoint.
 *
 * Calls the core `User.update` function and returns the result.
 * Returns a 500 error if update fails.
 */
export const updateByUserId = ApiHandler(async (_evt) => {
  try {
    const res = await User.updateByUserId(_evt);

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

/**
 * User deletion endpoint.
 *
 * Calls the core `User.delete` function and returns the result.
 * Returns a 500 error if delete fails.
 */
export const deleteByUserId = ApiHandler(async (_evt) => {
  try {
    const res = await User.deleteByUserId(_evt);

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
