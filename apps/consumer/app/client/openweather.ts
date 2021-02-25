import { Client } from "./types";
import { Config } from "../../config";
import axios, { AxiosInstance } from "axios";
import { DetailedLocation, Weather } from "../models";

type Data_2_5_WeatherResponse = {
  main: {
    temp: number;
    humidity: number;
  };
  wind: { speed: number };
  clouds?: {
    all: number;
  };
  rain?: {
    "1h": number;
  };
};

export default class OpenWeather implements Client {
  private client: AxiosInstance;
  constructor(config: Config) {
    this.client = axios.create({ baseURL: config.client.host, params: { appid: config.client.token } });
  }

  async getCurrentWeather({ id, lat, lon }: DetailedLocation): Promise<Weather> {
    try {
      const { data } = await this.client.get<Data_2_5_WeatherResponse>("data/2.5/weather", { params: { lat, lon } });
      const modelData: Weather = {
        id,
        wind: data?.wind.speed || 0,
        rain: (data?.rain || {})["1h"] || 0,
        cloudiness: data?.clouds?.all || 0,
        humidity: data.main.humidity,
        temperature: data.main.temp,
      };
      return modelData;
    } catch (err) {
      console.error(err);
      throw new Error("Couldn't read the data from OpenWeather");
    }
  }
}
