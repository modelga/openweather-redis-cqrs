import { Queue } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";
import { DetailedLocation, Weather } from "../models";

const UPDATE_REQUEST_CHANNEL = "UPDATE_REQUEST";
const TRACK_LOCATION_CHANNEL = "TRACK_LOCATION";
const UNTRACK_LOCATION_CHANNEL = "UNTRACK_LOCATION";
const WEATHER_UPDATED_CHANNEL = "WEATHER_UPDATED";

export class RedisQueue implements Queue {
  private queue: IoRedis.Redis;
  private publisher: IoRedis.Redis;

  constructor(config: Config) {
    this.queue = new IoRedis(config.queue.host);
    this.publisher = new IoRedis(config.queue.host);
  }

  async listenToUpdateRequest(callback: (weather: string) => void): Promise<string> {
    return this.subscribeToChannel<string>(UPDATE_REQUEST_CHANNEL, callback, (a) => a as string);
  }

  async listenToTrackLocation(callback: (weather: DetailedLocation) => void): Promise<string> {
    return this.subscribeToChannel<DetailedLocation>(TRACK_LOCATION_CHANNEL, callback, RedisQueue.parseJson);
  }

  async listenToUntrackLocation(callback: (weather: string) => void): Promise<string> {
    return this.subscribeToChannel<string>(UNTRACK_LOCATION_CHANNEL, callback, (a) => a as string);
  }

  async listenToWeatherData(callback: (weather: Weather) => void): Promise<string> {
    return this.subscribeToChannel(WEATHER_UPDATED_CHANNEL, callback, RedisQueue.parseJson);
  }

  async publishWeatherData(weather: Weather) {
    return this.publish(WEATHER_UPDATED_CHANNEL, JSON.stringify(weather));
  }

  async publishUpdateRequest(locationId: string) {
    return this.publish(UPDATE_REQUEST_CHANNEL, locationId);
  }

  private async publish(channel: string, message: string): Promise<void> {
    const consumers = await this.publisher.publish(channel, message);
    console.log(
      `Message of ${message.length} bytes, has been published on channel ${channel} to ${consumers} consumers`,
    );
    return;
  }

  private async subscribeToChannel<T>(
    channelToSubscribe: string,
    callback: (id: T) => void,
    transform: (m: any) => T,
  ): Promise<string> {
    await this.queue.subscribe(channelToSubscribe);
    this.queue.on("message", (channel, message) => {
      if (channel == channelToSubscribe) {
        callback(transform(message));
      }
    });
    return channelToSubscribe;
  }

  private static parseJson<T>(obj: any): T {
    return JSON.parse(obj) as T;
  }
}
