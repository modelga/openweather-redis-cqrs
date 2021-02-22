export type Weather = {
  name: string;
  slug: string;
  wind: number;
  cloudiness: number;
  rain: number;
  humidity: number;
  temperature: number;
};

export type HistoryWeather = Weather & { timestamp: number };

export type Location = {
  name: string;
  slug: string;
};

export type DetailedLocation = {
  name: string;
  lon: number;
  lat: number;
  country: string;
};
