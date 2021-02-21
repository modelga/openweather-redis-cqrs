import { Client } from "./types";
import { Config } from "../../config";
import axios, { AxiosInstance } from "axios";

type Geo1_0DirectResponse = {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
};

export default class OpenWeather implements Client {
  private client: AxiosInstance;
  constructor(config: Config) {
    this.client = axios.create({ baseURL: config.client.host, params: { appid: config.client.token } });
  }

  async queryForLocation(q: string) {
    try {
      const response = await this.client.get<Geo1_0DirectResponse[]>("geo/1.0/direct", { params: { q } });
      return response.data[0]?.name;
    } catch (err) {
      return;
    }
  }

  async getLocationDetails(location: string) {
    const response = await this.client.get<Geo1_0DirectResponse[]>("geo/1.0/direct", { params: { q: location } });
    if (!response.data[0]) {
      throw new Error(`Not found location ${location}`);
    }
    const { country, lat, lon, name } = response.data[0];
    return {
      country,
      lat,
      lon,
      name,
    };
  }
}