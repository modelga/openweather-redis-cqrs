import { DetailedLocation, Weather } from "../models";

export enum QueueTypes {
  Redis,
}
export interface Queue {
  listenToUpdateRequest(callback: (id: string) => void): Promise<string>;
  listenToWeatherData(callback: (id: Weather) => void): Promise<string>;

  listenToUntrackLocation(callback: (weather: string) => void): Promise<string>;
  listenToTrackLocation(callback: (weather: DetailedLocation) => void): Promise<string>;

  publishUpdateRequest(locationId: string): Promise<void>;
  publishWeatherData(weather: Weather): Promise<void>;
}
