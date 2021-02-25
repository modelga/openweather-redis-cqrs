import { Queue, RawMessage } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";
import { DetailedLocation, Weather } from "../models";

const UPDATE_REQUEST_CHANNEL = "UPDATE_REQUEST";
const TRACK_LOCATION_CHANNEL = "TRACK_LOCATION";
const UNTRACK_LOCATION_CHANNEL = "UNTRACK_LOCATION";
const WEATHER_UPDATED_CHANNEL = "WEATHER_UPDATED";
const ANY = "*";

export class RedisQueue implements Queue {
  private queue: IoRedis.Redis;

  constructor(host: string) {
    this.queue = new IoRedis(host);
  }
  async listenToAnyMessage(callback: (id: RawMessage) => void): Promise<string> {
    const transformToRawMessage: (m: any, channel: string) => RawMessage = (message, channel) => {
      return { date: Date.now(), message, channel };
    };

    return this.subscribeToChannel<RawMessage>(ANY, callback, transformToRawMessage);
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

  private async subscribeToChannel<T>(
    patternToSubscribe: string,
    callback: (id: T) => void,
    transform: (m: any, channel: string) => T = (a) => a,
  ): Promise<string> {
    await this.queue.psubscribe(patternToSubscribe);
    this.queue.on("pmessage", (pattern, channel, message) => {
      if (pattern === patternToSubscribe) {
        callback(transform(message, channel));
      }
    });
    return patternToSubscribe;
  }

  private static parseJson<T>(obj: any): T {
    return JSON.parse(obj) as T;
  }
}
