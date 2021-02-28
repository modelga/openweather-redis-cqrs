import { Config } from "../../config";
import OpenWeather from "./openweather";
import { Client, Clients } from "./types";

export * from "./types";

export function factory(config: Config): Client {
  switch (config.client.type) {
    case Clients.Openweather:
      return new OpenWeather(config);
    default:
      throw new Error(`Not found client for specified for type ${config.client.type}`);
  }
}
