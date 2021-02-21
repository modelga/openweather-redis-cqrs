import React, { createContext, useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { DataWithError } from "../utils";

type SearchResult = {
  name: string;
  slug: string;
};

export type LocationContextType = {
  isFetching: boolean;
  query: { value: string; set: (q: string) => void };
  searchResult: DataWithError<SearchResult>;
};

export const LocationContext = createContext<LocationContextType>(null!);
LocationContext.displayName = "LocationContext";

export const LocationContainer: React.FC<{}> = (props) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<DataWithError<SearchResult>>({ error: false });
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResult({ error: false });
      return;
    }
    setIsFetching(true);
    fetch(`/api/search/${query}`)
      .then((r) => {
        setIsFetching(false);
        if (r.status !== 200) {
          return;
        }
        return r.json() as Promise<{ name: string; slug: string }>;
      })
      .then((data) => {
        setSearchResult({ error: !!data, data });
      })
      .catch(() => setIsFetching(false));
  }, [debouncedQuery, setSearchResult]);

  return (
    <>
      <LocationContext.Provider
        value={{
          isFetching,
          query: { value: debouncedQuery, set: setQuery },
          searchResult,
        }}
      >
        {props.children}
      </LocationContext.Provider>
    </>
  );
};
