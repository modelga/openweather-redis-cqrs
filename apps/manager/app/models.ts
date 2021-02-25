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

export type DetailedLocation = {
  name: string;
  lon: number;
  lat: number;
  country: string;
  state?: string;
};

export type DetailedLocationWithId = DetailedLocation & { id: string };
export type DetailedLocationWithTracking = DetailedLocationWithId & { isTracked: boolean };
