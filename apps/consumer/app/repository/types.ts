import { Weather, HistoryWeather, DetailedLocation } from "../models";

export enum DBTypes {
  Redis,
}

export interface Repository {
  addLocationToTrack(locationId: string, detailedLocation: DetailedLocation): Promise<void>;

  getTrackedLocation(locationId: string): Promise<DetailedLocation>;
  getLatestWeatherAtLocation(locationId: string): Promise<HistoryWeather>;

  updateWeateherAtLocation(locationId: string, weather: Weather): Promise<void>;
  updateLatestWeatherAtLocation(locationId: string, weather: HistoryWeather): Promise<void>;

  deleteTrackedLocation(locationId: string): Promise<number>;
  deleteWeatherAtLocation(locationId: string): Promise<number>;
  deleteWeatherHistoryAtLocation(locationId: string): Promise<number>;
}
