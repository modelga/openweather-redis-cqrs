import { Queue } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";
import { DetailedLocationWithId } from "../models";

const UPDATE_REQUEST_CHANNEL = "UPDATE_REQUEST";
const TRACK_LOCATION_CHANNEL = "TRACK_LOCATION";
const UNTRACK_LOCATION_CHANNEL = "UNTRACK_LOCATION";

export class RedisQueue implements Queue {
  private queue: IoRedis.Redis;
  constructor(config: Config) {
    this.queue = new IoRedis(config.queue.host);
  }

  publishUpdateRequest(locationId: string): Promise<boolean> {
    return this.publish(UPDATE_REQUEST_CHANNEL, locationId);
  }

  publishTrackLocation(location: DetailedLocationWithId): Promise<boolean> {
    return this.publish(TRACK_LOCATION_CHANNEL, JSON.stringify(location));
  }

  publishUntrackLocation(locationId: string): Promise<boolean> {
    return this.publish(UNTRACK_LOCATION_CHANNEL, locationId);
  }

  private async publish(channel: string, data: string): Promise<boolean> {
    const count = await this.queue.publish(channel, data);
    return count > 0;
  }
}
