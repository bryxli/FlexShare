export * as User from "./user";
import { UserSchema } from "./utils/types";
import {
  authenticate,
  checkUserExists,
  deleteUser,
  getUser,
  updateUser,
} from "./utils/dynamo";

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { User } from "./utils/types";

/**
 * Registers a new user.
 *
 * @param event - The API Gateway event object containing the request body.
 * @returns The user object if registration is successful.
 * @throws Error if validation fails or if a user with the same `user_id` already exists.
 */
export async function register(event: APIGatewayProxyEventV2) {
  const body = event.body;

  if (!body) {
    throw new Error("Missing request body");
  }

  try {
    const parsed = JSON.parse(body);
    const schema = UserSchema.parse(parsed);

    const user: User = {
      user_id: schema.user_id,
    };

    const userExists = await checkUserExists(user.user_id);
    if (userExists) {
      throw new Error("Username already exists");
    }

    const res = await updateUser(user);

    if (res.$metadata.httpStatusCode === 200) {
      return (await getUser(user.user_id)).Item;
    } else {
      throw new Error(`Error occured while registering: ${res}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error: ${e.message}`);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

/**
 * Logs in a user.
 *
 * @param event - The API Gateway event object containing the login request.
 * @returns The user object if login is successful.
 * @throws Error if login fails.
 */
export async function login(event: APIGatewayProxyEventV2) {
  const body = event.body;

  if (!body) {
    throw new Error("Missing request body");
  }

  try {
    const parsed = JSON.parse(body);
    const schema = UserSchema.parse(parsed);

    const user: User = {
      user_id: schema.user_id,
    };

    const res = await authenticate(user);

    if (res && res.$metadata.httpStatusCode === 200) {
      return res.Item;
    } else {
      throw new Error(`Error occured while logging in: ${res}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error: ${e.message}`);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

/**
 * Retrieves a user by their `user_id`.
 *
 * @param event - The API Gateway event object containing the `user_id` to retrieve.
 * @returns The user object if retrieval is successful.
 * @throws Error if retrieval fails.
 */
export async function retrieveByUserId(event: APIGatewayProxyEventV2) {
  try {
    const path = event.rawPath;
    const parts = path.split("/");
    const user_id = parts[2];

    const res = await getUser(user_id);

    if (res && res.$metadata.httpStatusCode === 200) {
      return res.Item;
    } else {
      throw new Error(`Error occured while retrieving: ${res}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error: ${e.message}`);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

/**
 * Updates a user.
 *
 * @param event - The API Gateway event object containing the `user_id` and updates.
 * @returns The user object if update is successful.
 * @throws Error if update fails.
 */
export async function updateByUserId(event: APIGatewayProxyEventV2) {
  const body = event.body;

  if (!body) {
    throw new Error("Missing request body");
  }

  try {
    const parsed = JSON.parse(body);
    const schema = UserSchema.parse(parsed);

    const user: User = {
      user_id: schema.user_id,
      /* TODO: add other properties to update */
    };

    const res = await updateUser(user);

    if (res.$metadata.httpStatusCode === 200) {
      return (await getUser(user.user_id)).Item;
    } else {
      throw new Error(`Error occured while updating: ${res}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error: ${e.message}`);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

/**
 * Deletes a user by their `user_id`.
 *
 * @param event - The API Gateway event object containing the `user_id` to delete.
 * @returns The deletion result.
 * @throws Error if deletion fails.
 */
export async function deleteByUserId(event: APIGatewayProxyEventV2) {
  try {
    const path = event.rawPath;
    const parts = path.split("/");
    const user_id = parts[2];

    const res = await deleteUser(user_id);

    if (res && res.$metadata.httpStatusCode === 200) {
      return res;
    } else {
      throw new Error(`Error occured while deleting: ${res}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error: ${e.message}`);
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}
