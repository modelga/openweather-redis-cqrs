import { Client } from "../client";
import { DetailedLocationWithId, DetailedLocationWithTracking } from "../models";
import { TrackService } from "./track";
import { getLocationId } from "../utils/getLocationId";

export class SearchService {
  constructor(private readonly deps: { client: Client; trackService: TrackService }) {}
  async queryForLocation(loc: string): Promise<DetailedLocationWithTracking[]> {
    const locations = await this.deps.client.queryForLocation(loc);
    const uniqueLocationsWithId = locations
      .map((location) => ({ ...location, id: getLocationId(location) }))
      .reduce((acc, item) => {
        if (!acc.find((location) => location.id === item.id)) {
          acc.push(item);
        }
        return acc;
      }, [] as DetailedLocationWithId[]);

    return Promise.all(
      uniqueLocationsWithId.map(async (location) => {
        const isTracked = await this.deps.trackService.isTracked(location.id);
        return { ...location, isTracked };
      }),
    );
  }
}
