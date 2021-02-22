import { DetailedLocation, Weather } from "../models";

export enum Clients {
  Openweather,
}
export interface Client {
  getCurrentWeather(q: DetailedLocation): Promise<Weather>;
}
