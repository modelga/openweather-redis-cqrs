import { Client } from "../client";
import { DetailedLocation, Location } from "../models";
import { Repository } from "../repository";
import { slugify } from "../utils/slugify";

export class TrackService {
  constructor(private readonly deps: { repository: Repository; client: Client }) {}

  async isTracked(locationSlug: string): Promise<Boolean> {
    const isTracked = !!(await this.deps.repository.getTrackedLocation(locationSlug));
    return isTracked;
  }

  async trackLocation(location: string): Promise<Location & DetailedLocation> {
    const detailedLocation = await this.deps.client.getLocationDetails(location);
    const slug = slugify(detailedLocation.name);
    await this.deps.repository.addLocationToTrack(slug, detailedLocation);

    return { ...detailedLocation, slug };
  }
  async stopTracking(locationSlug: string): Promise<void> {
    await this.deps.repository.deleteLocationToTrack(locationSlug);
  }
}
