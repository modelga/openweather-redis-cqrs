import { Config } from "../../config";
import { RedisPublisher } from "./redis";
import { Publisher, PublisherTypes } from "./types";

export * from "./types";

export function factory(config: Config): Publisher {
  switch (config.publisher.type) {
    case PublisherTypes.Redis:
      return new RedisPublisher(config.publisher.host);
    default:
      throw new Error(`Not found client for specified for type ${config.client.type}`);
  }
}
