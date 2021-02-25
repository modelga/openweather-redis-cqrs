import { Client } from "./types";
import { Config } from "../../config";
import axios, { AxiosInstance } from "axios";
import { DetailedLocation } from "../models";

type Geo_1_0_DirectResponse = {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
};

export default class OpenWeather implements Client {
  private client: AxiosInstance;
  constructor(config: Config) {
    this.client = axios.create({ baseURL: config.client.host, params: { appid: config.client.token } });
  }

  async queryForLocation(q: string): Promise<DetailedLocation[]> {
    try {
      const response = await this.client.get<Geo_1_0_DirectResponse[]>("geo/1.0/direct", { params: { q, limit: 10 } });
      return response.data.map((data) => ({ ...data, local_names: undefined }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
