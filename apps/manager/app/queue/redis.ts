import { Queue } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";

const UPDATE_CHANNEL = "update_weather";

export class RedisQueue implements Queue {
  private queue: IoRedis.Redis;
  constructor(config: Config) {
    this.queue = new IoRedis(config.queue.host);
  }
  async forceUpdate(locationSlug: string): Promise<number> {
    const subscribers = await this.queue.publish(UPDATE_CHANNEL, locationSlug);
    return subscribers;
  }
}
