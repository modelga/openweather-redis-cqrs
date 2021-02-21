import { Repository } from "./types";
import { Config } from "../../config";
import IoRedis from "ioredis";
import { Weather, HistoryWeather, Location } from "../models";

export class Redis implements Repository {
  private db: IoRedis.Redis;
  constructor(config: Config) {
    this.db = new IoRedis(config.db.host);
  }
  async getLocationsToTrack(offset: number, limit: number): Promise<Location[]> {
    return [];
  }
  async addLocationToTrack(locationSlug: string): Promise<Location> {
    return null;
  }
  async deleteLocationToTrack(locationSlug: string): Promise<void> {}

  async getWeatherCurrentAtLocation(locationSlug: string): Promise<Weather> {
    return null;
  }
  async getWeatherHistoryAtLocation(locationSlug: string, offset: number, limit: number): Promise<HistoryWeather[]> {
    return [];
  }
}
