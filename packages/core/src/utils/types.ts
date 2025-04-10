/**
 * Defines the structure of a User object.
 *
 * This type represents the minimal information required to identify a user.
 * It includes a `user_id`, which is used as a unique identifier for the user.
 * Additional user-related fields can be added as the application grows.
 *
 * @property user_id - A unique identifier for the user, the partition key in DynamoDB.
 */

export type User = {
  user_id: string;
};
