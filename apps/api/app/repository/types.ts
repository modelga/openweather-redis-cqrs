import { DetailedLocationWithId, HistoryWeather, Weather } from "../models";

export enum DBTypes {
  Redis,
}

export interface Repository {
  getTrackedLocation(locationId: string): Promise<DetailedLocationWithId>;
  getWeatherCurrentAtLocation(locationSlug: string): Promise<Weather>;
  getWeatherHistoryAtLocation(locationSlug: string, offset: number, limit: number): Promise<HistoryWeather[]>;
}
