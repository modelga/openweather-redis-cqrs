import { DetailedLocation, Weather } from "../models";
export type RawMessage = {
  date: number;
  message: string;
  channel: string;
};
export enum QueueTypes {
  Redis,
}
export interface Queue {
  listenToAnyMessage(callback: (id: RawMessage) => void): Promise<string>;
  listenToUpdateRequest(callback: (id: string) => void): Promise<string>;
  listenToWeatherData(callback: (id: Weather) => void): Promise<string>;

  listenToUntrackLocation(callback: (weather: string) => void): Promise<string>;
  listenToTrackLocation(callback: (weather: DetailedLocation) => void): Promise<string>;
}
