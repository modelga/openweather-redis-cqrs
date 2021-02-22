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
  update: () => void;
  refresh: () => void;
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
  const refresh = useCallback(() => {
    if (searchResult.data && trackingResult.data) {
      const { slug } = searchResult.data;
      getData(slug);
    }
  }, [searchResult, trackingResult, getData]);

  const update = useCallback(async () => {
    if (updateStatus === UpdateStatus.SCHEDULED) {
      return;
    }
    const response = await fetch(`/api/update/${searchResult.data.slug}`, { method: "PUT" });
    setUpdateStatus(response.status === 204 ? UpdateStatus.SCHEDULED : UpdateStatus.FAILED);
  }, [searchResult, trackingResult, setUpdateStatus, updateStatus]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    console.log("Status change", UpdateStatus[updateStatus]);
    if (updateStatus === UpdateStatus.SCHEDULED) {
      const timer = setTimeout(async () => {
        await refresh();
        setUpdateStatus(UpdateStatus.UPDATED);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [updateStatus, refresh, setUpdateStatus]);

  return (
    <>
      <WeatherContext.Provider
        value={{
          updateStatus,
          result,
          update,
          refresh,
        }}
      >
        {props.children}
      </WeatherContext.Provider>
    </>
  );
};
