import { StackContext, Table } from "sst/constructs";

export function Dynamo({ stack }: StackContext) {
  const table = new Table(stack, "db", {
    fields: {
      user_id: "string",
    },
    primaryIndex: { partitionKey: "user_id" },
  });

  return { table };
}
