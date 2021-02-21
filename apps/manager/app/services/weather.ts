import { Client } from "../client";
import { HistoryWeather, Weather } from "../models";
import { Repository } from "../repository/types";
import { slugify } from "../utils";

export class WeatherService {
  constructor(private readonly deps: { repository: Repository }) {}
  async getCurrentWeather(slug: string): Promise<Weather> {
    const weather = await this.deps.repository.getWeatherCurrentAtLocation(slug);
    return weather;
  }
  async getHistoryWeather(slug: string, offset: number = 0, limit: number = 10): Promise<HistoryWeather[]> {
    const historyWeather = await this.deps.repository.getWeatherHistoryAtLocation(slug, offset, limit);
    return historyWeather;
  }
}
