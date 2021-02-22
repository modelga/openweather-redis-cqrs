import { Weather } from "../models";

export enum QueueTypes {
  Redis,
}
export interface Queue {
  listenToUpdateRequest(callback: (slug: string) => void): Promise<void>;
  listenToWeatherData(callback: (slug: Weather) => void): Promise<void>;
  publishWeatherData(weather: Weather): Promise<void>;
}
