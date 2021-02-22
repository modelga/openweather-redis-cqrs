import { Weather, HistoryWeather, DetailedLocation } from "../models";

export enum DBTypes {
  Redis,
}

export interface Repository {
  getTrackedLocation(locationSlug: string): Promise<DetailedLocation>;

  updateWeateherAtLocation(locationSlug: string, weather: Weather): Promise<void>;
  getLatestWeatherAtLocation(locationSlug: string): Promise<HistoryWeather>;
  updateLatestWeatherAtLocation(locationSlug: string, weather: HistoryWeather): Promise<void>;
}
