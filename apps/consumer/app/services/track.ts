import { DetailedLocation } from "../models";
import { Queue } from "../queue";
import { Repository } from "../repository";
import { ListeningInterface } from "./types";

export class TrackLocationService implements ListeningInterface {
  constructor(private readonly deps: { repository: Repository; queue: Queue }) {}
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
    const { repository, queue } = this.deps;
    repository.addLocationToTrack(location.id, location);
    queue.publishUpdateRequest(location.id);
  }
}
