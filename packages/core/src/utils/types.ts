import { z } from "zod";

/**
 * The structure of a user object.
 * @property user_id - A unique identifier for the user, the partition key in DynamoDB.
 */
export const UserSchema = z.object({
  user_id: z.string(),
});

/**
 * User type inferred from UserSchema.
 */
export type User = z.infer<typeof UserSchema>;
