import { Client } from "../client";
import { Publisher } from "../publisher";
import { Queue } from "../queue";
import { Repository } from "../repository";
import { ListeningInterface } from "./types";

export class UpdateRequestService implements ListeningInterface {
  constructor(private readonly deps: { repository: Repository; queue: Queue; client: Client; publisher: Publisher }) {}
  listen() {
    const { queue } = this.deps;

    return queue.listenToUpdateRequest((id: string) => this.listenToUpdateRequest(id));
  }
  async listenToUpdateRequest(locationId: string) {
    const { repository, client, publisher } = this.deps;
    const location = await repository.getTrackedLocation(locationId);
    const weather = await client.getCurrentWeather(location);
    await publisher.publishWeatherData(weather);
  }
}
