export type Weather = {
  id: string;
  wind: number;
  cloudiness: number;
  rain: number;
  humidity: number;
  temperature: number;
};

export type HistoryWeather = Weather & { timestamp: number };

export type DetailedLocation = {
  id: string;
  name: string;
  lon: number;
  lat: number;
  country: string;
  state: string;
};
