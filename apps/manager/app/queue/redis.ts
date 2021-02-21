import { Queue } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";

export class RedisQueue implements Queue {
  private queue: IoRedis.Redis;
  constructor(config: Config) {
    this.queue = new IoRedis(config.queue.host);
  }
  async forceUpdate(locationSlug: string): Promise<void> {
    await this.queue.publish("Update", locationSlug);
    return;
  }
}
