import { Repository } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";
import { Weather, HistoryWeather, Location, DetailedLocation } from "../models";

enum Prefix {
  WEATHER_CURRENT = "weather_current",
  WEATHER_HISTORY = "weather_history",
  TRACKING = "location_tracking",
}
export class RedisRepository implements Repository {
  private db: IoRedis.Redis;
  constructor(config: Config) {
    this.db = new IoRedis(config.db.host);
  }

  async addLocationToTrack(locationSlug: string, detailedLocation: DetailedLocation): Promise<void> {
    await this.set(Prefix.TRACKING, locationSlug, detailedLocation);
    return;
  }
  async getTrackedLocation(locationSlug: string): Promise<DetailedLocation> {
    return this.get(Prefix.TRACKING, locationSlug);
  }

  async deleteLocationToTrack(locationSlug: string): Promise<void> {
    const deleted = await this.del(Prefix.TRACKING, locationSlug);
    if (deleted === 0) {
      throw new Error("Key didn't exists");
    }
  }

  async getWeatherCurrentAtLocation(locationSlug: string): Promise<Weather> {
    return this.get(Prefix.WEATHER_CURRENT, locationSlug);
  }
  async getWeatherHistoryAtLocation(locationSlug: string, offset: number, limit: number): Promise<HistoryWeather[]> {
    return this.lrange(Prefix.WEATHER_HISTORY, locationSlug, offset, limit);
  }

  async set(type: Prefix, key: string, data: any): Promise<void> {
    await this.db.set(`${type}_${key}`, JSON.stringify(data));
  }

  async lrange<T>(type: Prefix, key: string, offset: number, limit: number): Promise<T[]> {
    const data = (await this.db.lrange(`${type}_${key}`, offset, limit)) as any[];
    return data?.map((data) => JSON.parse(data)) as T[];
  }

  async get<T>(type: Prefix, key: string): Promise<T> {
    const data = await this.db.get(`${type}_${key}`);
    return JSON.parse(data) as T;
  }
  async del(type: Prefix, key: string): Promise<number> {
    const count = (await this.db.del(`${type}_${key}`)) as number;
    return count;
  }
}
