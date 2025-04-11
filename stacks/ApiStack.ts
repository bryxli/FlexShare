import { Api, StackContext, use } from "sst/constructs";
import { Dynamo } from "./DynamoStack";

/**
 * Defines the API stack, including routes and permissions
 * for handling basic user account operations.
 *
 * @param stack - The SST StackContext, provided automatically by SST.
 * @returns An object containing the API construct.
 */
export function API({ stack }: StackContext) {
  const { users, posts } = use(Dynamo);
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        runtime: "nodejs20.x",
        permissions: [users, posts],
      },
    },
    routes: {
      /**
       * @route GET /
       * Returns a simple health check response.
       */
      "GET /": "packages/functions/src/health.handler",

      /**
       * @route POST /user/register
       * Creates a new user account.
       */
      "POST /user/register": "packages/functions/src/user.register",

      /**
       * @route POST /user/login
       * Authenticates an existing user.
       */
      "POST /user/login": "packages/functions/src/user.login",

      /**
       * @route GET /user/{id}
       * Retrieves a user by ID.
       */
      "GET /user/{id}": "packages/functions/src/user.retrieveByUserId",

      /**
       * @route PUT /user
       * Updates a user's profile or settings.
       */
      "PUT /user": "packages/functions/src/user.update",

      /**
       * @route DELETE /user/{id}
       * Deletes a user account by ID.
       */
      "DELETE /user/{id}": "packages/functions/src/user.deleteByUserId",

      /**
       * @route POST /post/create
       * Creates a new post.
       */
      "POST /post/create": "packages/functions/src/post.create",

      /**
       * @route GET /post/{id}
       * Retrieves a post by ID.
       */
      "GET /post/{id}": "packages/functions/src/post.retrieveByPostId",

      /**
       * @route POST /post
       * Updates an existing post.
       */
      "POST /post/update": "packages/functions/src/post.update",

      /**
       * @route DELETE /post/{id}
       * Deletes a post by ID.
       */
      "DELETE /post/{id}": "packages/functions/src/user.deleteByPostId",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
