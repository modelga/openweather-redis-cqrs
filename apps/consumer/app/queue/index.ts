import { Config } from "../../config";
import { RedisQueue } from "./redis";
import { QueueTypes, Queue } from "./types";
export * from "./types";

export function factory(config: Config): Queue {
  switch (config.queue.type) {
    case QueueTypes.Redis:
      return new RedisQueue(config);
    default:
      throw new Error(`Not found client for specified for type ${config.client.type}`);
  }
}
