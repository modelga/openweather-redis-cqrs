import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { SearchResult } from "./SearchContext";

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

export type WeatherResult = {
  current: Weather;
  history: HistoryWeather[];
};

export type WeatherContextType = {
  get: (searchResult: SearchResult) => Promise<WeatherResult>;
  update: (searchResult: SearchResult) => Promise<WeatherResult>;
};

export const WeatherContext = createContext<WeatherContextType>(null!);
WeatherContext.displayName = "WeatherContext";

export const WeatherContainer: React.FC<{}> = (props) => {
  const getData = useCallback(async (searchResult: SearchResult) => {
    const response = await fetch(`/api/weather/${searchResult.id}`);
    if (response.status !== 200) {
      return null;
    }
    const data = (await response.json()) as WeatherResult;
    return data;
  }, []);

  const update = useCallback(async (searchResult: SearchResult) => {
    const response = await fetch(`/api/update/${searchResult.id}`, { method: "PUT" });
    return new Promise<WeatherResult>((resolve, reject) => {
      if (response.status != 204) {
        reject();
      } else {
        setTimeout(async () => {
          resolve(getData(searchResult));
        }, 1200);
      }
    });
  }, []);

  return (
    <>
      <WeatherContext.Provider
        value={{
          update,
          get: getData,
        }}
      >
        {props.children}
      </WeatherContext.Provider>
    </>
  );
};
