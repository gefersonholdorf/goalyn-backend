import { Queue } from "bullmq";
import { redisConnection } from "./connection";

export const matchQueue = new Queue(
  "match-simulation",
  {
    connection: redisConnection,
  }
);