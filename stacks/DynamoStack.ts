import { StackContext, Table } from "sst/constructs";

export function Dynamo({ stack }: StackContext) {
  const users = new Table(stack, "users", {
    fields: {
      user_id: "string",
    },
    primaryIndex: { partitionKey: "user_id" },
  });

  return { users };
}
