import { Queue } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";
import { Weather } from "../models";

const UPDATE_REQUEST_CHANNEL = "UPDATE_REQUEST";
const WEATHER_UPDATED_CHANNEL = "WEATHER_UPDATED";

export class RedisQueue implements Queue {
  private queue: IoRedis.Redis;
  private publisher: IoRedis.Redis;

  constructor(config: Config) {
    this.queue = new IoRedis(config.queue.host);
    this.publisher = new IoRedis(config.queue.host);
  }

  async listenToUpdateRequest(callback: (slug: string) => void): Promise<void> {
    await this.subscribeToChannel<string>(UPDATE_REQUEST_CHANNEL, callback, (a) => a as string);
  }

  async listenToWeatherData(callback: (slug: Weather) => void): Promise<void> {
    await this.subscribeToChannel(WEATHER_UPDATED_CHANNEL, callback, (a) => JSON.parse(a) as Weather);
  }

  async publishWeatherData(weather: Weather) {
    await this.publisher.publish(WEATHER_UPDATED_CHANNEL, JSON.stringify(weather));
  }

  private async subscribeToChannel<T>(
    channelToSubscribe: string,
    callback: (slug: T) => void,
    transform: (m: any) => T,
  ) {
    await this.queue.subscribe(channelToSubscribe);
    this.queue.on("message", (channel, message) => {
      if (channel == channelToSubscribe) {
        callback(transform(message));
      }
    });
  }
}
