import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DataWithError } from "../utils";
import { SearchContext } from "./SearchContext";
import { TrackingContext } from "./TrackingContext";

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

type Result = {
  current: Weather;
  history: HistoryWeather[];
};

enum UpdateStatus {
  NONE,
  SCHEDULED,
  FAILED,
  UPDATED,
}

export type WeatherContextType = {
  result: DataWithError<Result>;
  updateStatus: UpdateStatus;
  update: () => {};
};

export const WeatherContext = createContext<WeatherContextType>(null!);
WeatherContext.displayName = "WeatherContext";

export const WeatherContainer: React.FC<{}> = (props) => {
  const { searchResult } = useContext(SearchContext);
  const { result: trackingResult } = useContext(TrackingContext);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>(UpdateStatus.NONE);
  const [result, setResult] = useState<DataWithError<Result>>({ error: false });

  const getData = useCallback(
    async (slug: string) => {
      const response = await fetch(`/api/weather/${slug}`);
      if (response.status !== 200) {
        setResult({ error: true });
        return;
      }
      const data = (await response.json()) as Result;
      setResult({ error: !data, data });
    },
    [setResult],
  );

  const update = useCallback(async () => {
    setUpdateStatus(UpdateStatus.NONE);
    const response = await fetch(`/api/update/${searchResult.data.slug}`, { method: "PUT" });
    if (response.status !== 200) {
      setUpdateStatus(UpdateStatus.FAILED);
      return;
    }
    setUpdateStatus(UpdateStatus.SCHEDULED);
  }, [searchResult, trackingResult, setUpdateStatus]);

  useEffect(() => {
    if (searchResult.data && trackingResult.data) {
      const { slug } = searchResult.data;
      getData(slug);
    }
  }, [trackingResult, searchResult]);

  return (
    <>
      <WeatherContext.Provider
        value={{
          updateStatus,
          result,
          update,
        }}
      >
        {props.children}
      </WeatherContext.Provider>
    </>
  );
};
