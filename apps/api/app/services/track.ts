import { DetailedLocation } from "../models";
import { Queue } from "../queue";
import { Repository } from "../repository";
import { getLocationId } from "../utils/getLocationId";

export class TrackService {
  constructor(private readonly deps: { repository: Repository; queue: Queue }) {}

  async isTracked(id: string): Promise<boolean> {
    const detailedLocation = await this.deps.repository.getTrackedLocation(id);
    return !!detailedLocation;
  }

  trackLocation(location: DetailedLocation): Promise<boolean> {
    const id = getLocationId(location);
    return this.deps.queue.publishTrackLocation({ id, ...location });
  }
  stopTracking(id: string): Promise<boolean> {
    return this.deps.queue.publishUntrackLocation(id);
  }
}
