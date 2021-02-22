import React, { createContext, useCallback, useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { DataWithError } from "../utils";

type SearchResult = {
  name: string;
  slug: string;
};

export type SearchContextType = {
  query: { value: string; set: (q: string) => void };
  searchResult: DataWithError<SearchResult>;
};

export const SearchContext = createContext<SearchContextType>(null!);
SearchContext.displayName = "SearchContext";

export const SearchContainer: React.FC<{}> = (props) => {
  const [query, setQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<DataWithError<SearchResult>>({ error: false });
  const debouncedQuery = useDebounce(query, 300);

  const doLookup = useCallback(
    async (query: string) => {
      const response = await fetch(`/api/search/${query}`);
      if (response.status !== 200) {
        setSearchResult({ error: true });
        return;
      }
      const data = (await response.json()) as SearchResult;
      setSearchResult({ error: !data, data });
    },
    [setSearchResult],
  );

  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResult({ error: false });
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
        }}
      >
        {props.children}
      </SearchContext.Provider>
    </>
  );
};
