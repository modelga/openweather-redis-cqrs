import { Weather } from "../models";
import { Queue } from "../queue";
import { Repository } from "../repository";
import { ListeningInterface } from "./types";

export class HistoryWeatherService implements ListeningInterface {
  constructor(private readonly deps: { repository: Repository; queue: Queue }) {}

  listen() {
    return this.deps.queue.listenToWeatherData((weather: Weather) => this.listenToWeatherData(weather));
  }

  async listenToWeatherData(weather: Weather) {
    const { id } = weather;
    const { repository } = this.deps;
    const oldWeather = await repository.getLatestWeatherAtLocation(id);
    if (HistoryWeatherService.isEqual(weather, oldWeather)) {
    } else {
      repository.updateLatestWeatherAtLocation(id, { ...weather, timestamp: Date.now() });
    }
  }
  static isEqual(current: Weather, old: Weather) {
    if (!current || !old) {
      return false;
    }
    return (
      current.cloudiness === old.cloudiness &&
      current.humidity === old.humidity &&
      current.rain === old.rain &&
      current.temperature === old.temperature &&
      current.wind === old.wind
    );
  }
}
