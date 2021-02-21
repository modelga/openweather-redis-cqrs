import { DetailedLocation } from "../models";

export enum Clients {
  Openweather,
}
export interface Client {
  queryForLocation(q: string): Promise<string>;
  getLocationDetails(location: string): Promise<DetailedLocation>;
}
