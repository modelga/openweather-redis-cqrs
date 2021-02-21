import { Client } from "../client";
import { DetailedLocation, Location } from "../models";
import { Repository } from "../repository";
import { slugify } from "../utils/slugify";

export class TrackService {
  constructor(private readonly deps: { repository: Repository; client: Client }) {}

  async isTracked(slug: string): Promise<DetailedLocation & Location> {
    const location = await this.deps.repository.getTrackedLocation(slug);
    return { ...location, slug };
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
