import { Config } from "../../config";
import { Redis } from "./redis";
import { QueueTypes, Queue } from "./types";
export * from "./types";

export function factory(config: Config): Queue {
  switch (config.queue.type) {
    case QueueTypes.Redis:
      return new Redis(config);
    default:
      throw new Error(`Not found client for specified for type ${config.client.type}`);
  }
}
