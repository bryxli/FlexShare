export * as Post from "./post";

import type { APIGatewayProxyEventV2 } from "aws-lambda";

/**
 * Creates a post.
 *
 * @param event - The API Gateway event object containing the post.
 * @returns The post object if update is successful.
 * @throws Error if creating post fails or user is not logged in.
 */
export async function create(event: APIGatewayProxyEventV2) {
  return event;
}

/**
 * Retrieves a post by `post_id`.
 *
 * @param event - The API Gateway event object containing the `post_id` to retrieve.
 * @returns The post object if retrieval is successful.
 * @throws Error if retrieval fails.
 */
export async function retrieveByPostId(event: APIGatewayProxyEventV2) {
  return event;
}

/**
 * Updates a post.
 *
 * @param event - The API Gateway event object containing the post.
 * @returns The post object if update is successful.
 * @throws Error if update fails.
 */
export async function update(event: APIGatewayProxyEventV2) {
  return event;
}

/**
 * Deletes a post by `post_id`.
 *
 * @param event - The API Gateway event object containing the `post_id` to delete.
 * @returns The deletion result.
 * @throws Error if deletion fails.
 */
export async function deleteByPostId(event: APIGatewayProxyEventV2) {
  return event;
}
