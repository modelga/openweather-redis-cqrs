import { HistoryWeather, Weather } from "../models";
import { Repository } from "../repository/types";

export class WeatherService {
  constructor(private readonly deps: { repository: Repository }) {}

  async getCurrentWeather(id: string): Promise<Weather> {
    const weather = await this.deps.repository.getWeatherCurrentAtLocation(id);
    return weather;
  }

  async getHistoryWeather(id: string, offset: number = 0, limit: number = 10): Promise<HistoryWeather[]> {
    const historyWeather = await this.deps.repository.getWeatherHistoryAtLocation(id, offset, limit);
    return historyWeather;
  }
}
