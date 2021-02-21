import { Queue } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";

export class Redis implements Queue {
  private db: IoRedis.Redis;
  constructor(config: Config) {
    this.db = new IoRedis(config.queue.host);
  }
  async forceUpdate(locationSlug: string): Promise<void> {
    await this.db.publish("Update", locationSlug);
    return;
  }
}
o;
