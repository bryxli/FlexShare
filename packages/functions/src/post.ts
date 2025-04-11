import { ApiHandler } from "sst/node/api";
import { Post } from "@FlexShare/core/post";

/**
 * Post creation endpoint.
 *
 * Calls the core `Post.create` function and returns the result.
 * Returns a 500 error if post creation fails.
 */
export const create = ApiHandler(async (_evt) => {
  try {
    const res = await Post.create(_evt);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: e.message }),
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
 * Post retrieval endpoint.
 *
 * Calls the core `Post.retrieveByPostId` function and returns the result.
 * Returns a 500 error if retrieve fails.
 */
export const retrieveByPostId = ApiHandler(async (_evt) => {
  try {
    const res = await Post.retrieveByPostId(_evt);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: e.message }),
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
 * Post update endpoint.
 *
 * Calls the core `Post.update` function and returns the result.
 * Returns a 500 error if post update fails.
 */
export const update = ApiHandler(async (_evt) => {
  try {
    const res = await Post.update(_evt);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: e.message }),
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
 * Post deletion endpoint.
 *
 * Calls the core `Post.deleteByPostId` function and returns the result.
 * Returns a 500 error if delete fails.
 */
export const deleteByPostId = ApiHandler(async (_evt) => {
  try {
    const res = await Post.deleteByPostId(_evt);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: e.message }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  }
});
