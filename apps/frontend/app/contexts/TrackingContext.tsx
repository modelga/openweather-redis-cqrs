import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DataWithError } from "../utils";
import { SearchContext } from "./SearchContext";

type Result = {
  country: string;
  name: string;
  lat: number;
  lon: number;
};

export type TrackingContextType = {
  result: DataWithError<Result>;
  track: () => void;
  unTrack: () => void;
};

export const TrackingContext = createContext<TrackingContextType>(null!);
TrackingContext.displayName = "TrackingContext";

export const TrackingContainer: React.FC<{}> = (props) => {
  const { searchResult } = useContext(SearchContext);
  const [result, setResult] = useState<DataWithError<Result>>({ error: false });

  const checkTrack = useCallback(async () => {
    if (searchResult.data) {
      const { slug } = searchResult.data;
      const tracked = await fetch(`/api/track/${slug}`);
      if (tracked.status !== 200) {
        setResult({ error: true });
        return;
      }
      const data = (await tracked.json()) as Result;
      setResult({ error: !data, data });
    }
  }, [setResult, searchResult]);

  useEffect(() => {
    checkTrack();
  }, [checkTrack]);

  const track = useCallback(async () => {
    const { slug } = searchResult.data;
    const response = await fetch(`/api/track/${slug}`, { method: "post" });
    if (response.status !== 200) {
      setResult({ error: false });
    }
    const data = (await response.json()) as Result;
    setResult({ error: !data, data });
  }, [searchResult]);

  const unTrack = useCallback(async () => {
    const { slug } = searchResult.data;
    const response = await fetch(`/api/track/${slug}`, { method: "delete" });
    if (response.status !== 204) {
      setResult({ error: false });
    }
    checkTrack();
  }, [result, searchResult, setResult, checkTrack]);

  return (
    <>
      <TrackingContext.Provider
        value={{
          result,
          track,
          unTrack,
        }}
      >
        {props.children}
      </TrackingContext.Provider>
    </>
  );
};
