import { Weather, HistoryWeather, DetailedLocation } from "../models";

export enum DBTypes {
  Redis,
}

export interface Repository {
  getTrackedLocation(locationSlug: string): Promise<DetailedLocation>;
  addLocationToTrack(locationSlug: string, detailedLocation: DetailedLocation): Promise<void>;
  deleteLocationToTrack(locationSlug: string): Promise<void>;

  getWeatherCurrentAtLocation(locationSlug: string): Promise<Weather>;
  getWeatherHistoryAtLocation(locationSlug: string, offset: number, limit: number): Promise<HistoryWeather[]>;
}
