import { SSTConfig } from "sst";
import { Dynamo } from "./stacks/DynamoStack";

export default {
  config() {
    return {
      name: "FlexShare",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Dynamo);
  },
} satisfies SSTConfig;
