import { Weather } from "../models";
import { Queue } from "../queue";
import { Repository } from "../repository";
import { ListeningInterface } from "./types";

export class CurrentWeatherService implements ListeningInterface {
  constructor(private readonly deps: { repository: Repository; queue: Queue }) {}
  listen() {
    return this.deps.queue.listenToWeatherData((weather: Weather) => this.listenToWeatherData(weather));
  }
  listenToWeatherData(weather: Weather) {
    this.deps.repository.updateWeateherAtLocation(weather.id, weather);
  }
}
