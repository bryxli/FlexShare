import { SSTConfig } from "sst";
import { Dynamo } from "./stacks/DynamoStack";
import { API } from "./stacks/ApiStack";

export default {
  config() {
    return {
      name: "FlexShare",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Dynamo).stack(API);
  },
} satisfies SSTConfig;
