import { Client } from "../client";
import { Queue } from "../queue";
import { Repository } from "../repository";
import { ListeningInterface } from "./types";

export class UpdateRequestService implements ListeningInterface {
  constructor(private readonly deps: { repository: Repository; queue: Queue; client: Client }) {}
  listen() {
    const { queue } = this.deps;

    queue.listenToUpdateRequest((slug: string) => this.listenToUpdateRequest(slug));
  }
  async listenToUpdateRequest(slug: string) {
    const { repository, queue, client } = this.deps;
    const location = { ...(await repository.getTrackedLocation(slug)), slug };
    const weather = await client.getCurrentWeather(location);
    await queue.publishWeatherData(weather);
  }
}
