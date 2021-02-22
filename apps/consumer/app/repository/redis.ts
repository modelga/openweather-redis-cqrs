import { Repository } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";
import { Weather, HistoryWeather, Location, DetailedLocation } from "../models";

enum Prefix {
  WEATHER_CURRENT = "weather_current",
  WEATHER_HISTORY = "weather_history",
  TRACKING = "location_tracking",
}

function createKey(type: Prefix, key: string): string {
  return `${type}_${key}`;
}

export class RedisRepository implements Repository {
  private db: IoRedis.Redis;
  constructor(config: Config) {
    this.db = new IoRedis(config.db.host);
  }

  getTrackedLocation(locationSlug: string): Promise<DetailedLocation> {
    return this.get(Prefix.TRACKING, locationSlug);
  }
  async updateWeateherAtLocation(locationSlug: string, weather: Weather) {
    await this.set(Prefix.WEATHER_CURRENT, locationSlug, weather);
  }
  async updateLatestWeatherAtLocation(locationSlug: string, weather: HistoryWeather): Promise<void> {
    await this.lpush(Prefix.WEATHER_HISTORY, locationSlug, weather);
  }

  getLatestWeatherAtLocation(locationSlug: string): Promise<HistoryWeather> {
    return this.lindex(Prefix.WEATHER_HISTORY, locationSlug, 0);
  }

  private async set(type: Prefix, key: string, data: any): Promise<void> {
    await this.db.set(createKey(type, key), JSON.stringify(data));
  }

  private async lindex<T>(type: Prefix, key: string, offset: number): Promise<T> {
    const data = await this.db.lindex(createKey(type, key), offset);
    return data ? (JSON.parse(data) as T) : undefined;
  }

  private async lpush(type: Prefix, key: string, data: any): Promise<void> {
    await this.db.lpush(createKey(type, key), JSON.stringify(data));
  }

  private async get<T>(type: Prefix, key: string): Promise<T> {
    const data = await this.db.get(createKey(type, key));
    return JSON.parse(data) as T;
  }
}
