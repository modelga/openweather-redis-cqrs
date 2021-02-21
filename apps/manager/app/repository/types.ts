import { Location, Weather, HistoryWeather } from "../models";

export enum DBTypes {
  Redis,
}

export interface Repository {
  getLocationsToTrack(offset: number, limit: number): Promise<Location[]>;
  addLocationToTrack(locationSlug: string): Promise<Location>;
  deleteLocationToTrack(locationSlug: string): Promise<void>;

  getWeatherCurrentAtLocation(locationSlug: string): Promise<Weather>;
  getWeatherHistoryAtLocation(locationSlug: string, offset: number, limit: number): Promise<HistoryWeather[]>;
}
