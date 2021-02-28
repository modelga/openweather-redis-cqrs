import { DetailedLocation } from "../models";
import { Publisher } from "../publisher";
import { Queue } from "../queue";
import { Repository } from "../repository";
import { ListeningInterface } from "./types";

export class TrackLocationService implements ListeningInterface {
  constructor(private readonly deps: { repository: Repository; queue: Queue; publisher: Publisher }) {}
  listen() {
    const { queue } = this.deps;
    return [
      queue.listenToTrackLocation((location: DetailedLocation) => this.listenToTrackLocation(location)),
      queue.listenToUntrackLocation((locationId: string) => this.listenToUntrackLocation(locationId)),
    ];
  }

  async listenToUntrackLocation(locationId: string) {
    const { repository, queue } = this.deps;
    return Promise.all([
      repository.deleteTrackedLocation(locationId),
      repository.deleteWeatherAtLocation(locationId),
      repository.deleteWeatherHistoryAtLocation(locationId),
    ]);
  }
  async listenToTrackLocation(location: DetailedLocation) {
    const { repository, publisher } = this.deps;
    await repository.addLocationToTrack(location.id, location);
    await publisher.publishUpdateRequest(location.id);
  }
}
