import React, { createContext, useCallback, useEffect, useState } from "react";

import { useDebounce } from "../hooks/useDebounce";

export type SearchResult = {
  name: string;
  id: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
  isTracked: boolean;
};

export type SearchContextType = {
  query: { value: string; set: (q: string) => void };
  searchResult: SearchResult[];
  refresh: () => Promise<void>;
};

export const SearchContext = createContext<SearchContextType>(null!);
SearchContext.displayName = "SearchContext";

export const SearchContainer: React.FC<{}> = (props) => {
  const [query, setQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  const doLookup = useCallback(
    async (query: string) => {
      const response = await fetch(`/api/search?q=${query}`);
      if (response.status !== 200) {
        setSearchResult([]);
        return;
      }
      const data = (await response.json()) as SearchResult[];
      setSearchResult(data);
    },
    [setSearchResult],
  );

  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResult([]);
      return;
    }
    doLookup(debouncedQuery);
  }, [doLookup, debouncedQuery, setSearchResult]);

  return (
    <>
      <SearchContext.Provider
        value={{
          query: { value: debouncedQuery, set: setQuery },
          searchResult,
          refresh: () => doLookup(debouncedQuery),
        }}
      >
        {props.children}
      </SearchContext.Provider>
    </>
  );
};
