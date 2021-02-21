export enum Clients {
  Openweather,
}
export interface Client {
  queryForLocation(q: string): Promise<string>;
}
