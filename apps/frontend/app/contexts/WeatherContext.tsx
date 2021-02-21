import React, { createContext, useContext, useEffect, useState } from "react";
import { DataWithError } from "../utils";
import { LocationContext } from "./LocationContext";

type Result = {};

export type WeatherContextType = {
  isFetching: boolean;
  // query: { value: string; set: (q: string) => void };
  searchResult: DataWithError<Result>;
};

export const WeatherContext = createContext<WeatherContextType>(null!);
WeatherContext.displayName = "LocationContext";

export const WeatherContainer: React.FC<{}> = (props) => {
  const { searchResult } = useContext(LocationContext);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    if (searchResult.data) {
      setIsFetching(true);
      const { slug } = searchResult.data;
      Promise.all(fetch(`/api/track/${slug}`))
        .then(([current]) => {
          setIsFetching(false);
          if (current.status !== 200) {
            return;
          }
          return current.json() as Promise<{ name: string; slug: string }>;
        })
        .then((data) => {
          // setSearchResult({ error: !!data, data });
        })
        .catch(() => setIsFetching(false));
    }
  }, [searchResult]);

  return (
    <>
      <WeatherContext.Provider
        value={{
          isFetching,
          // query: { value: debouncedQuery, set: setQuery },
          searchResult,
        }}
      >
        {props.children}
      </WeatherContext.Provider>
    </>
  );
};
