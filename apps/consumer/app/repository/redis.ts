import IoRedis from "ioredis";

import { Config } from "../../config";
import { DetailedLocation, HistoryWeather, Weather } from "../models";
import { Repository } from "./types";

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

  async addLocationToTrack(locationId: string, detailedLocation: DetailedLocation): Promise<void> {
    await this.set(Prefix.TRACKING, locationId, detailedLocation);
    return;
  }

  async deleteTrackedLocation(locationId: string): Promise<number> {
    const count = await this.del(Prefix.TRACKING, locationId);
    return count;
  }

  getTrackedLocation(locationId: string): Promise<DetailedLocation> {
    return this.get(Prefix.TRACKING, locationId);
  }

  async updateWeateherAtLocation(locationId: string, weather: Weather) {
    await this.set(Prefix.WEATHER_CURRENT, locationId, weather);
  }

  deleteWeatherAtLocation(locationId: string): Promise<number> {
    return this.del(Prefix.WEATHER_CURRENT, locationId);
  }
  async updateLatestWeatherAtLocation(locationId: string, weather: HistoryWeather): Promise<void> {
    await this.lpush(Prefix.WEATHER_HISTORY, locationId, weather);
  }

  getLatestWeatherAtLocation(locationId: string): Promise<HistoryWeather> {
    return this.lindex(Prefix.WEATHER_HISTORY, locationId, 0);
  }

  deleteWeatherHistoryAtLocation(locationId: string): Promise<number> {
    return this.del(Prefix.WEATHER_HISTORY, locationId);
  }
  private async set(type: Prefix, key: string, data: any): Promise<void> {
    await this.db.set(createKey(type, key), JSON.stringify(data));
  }

  private async del(type: Prefix, key: string): Promise<number> {
    return await this.db.del(createKey(type, key));
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
