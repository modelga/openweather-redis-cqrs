import { Weather } from "../models";
import { Topics } from "../topics";

export enum PublisherTypes {
  Redis,
}
export interface Publisher {
  publishToTopic(topic: Topics, message: any): Promise<void>;
  publishUpdateRequest(locationId: string): Promise<void>;
  publishWeatherData(weather: Weather): Promise<void>;
}
