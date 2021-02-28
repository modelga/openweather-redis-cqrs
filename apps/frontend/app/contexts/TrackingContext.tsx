import React, { createContext, useCallback, useContext } from "react";

import { SearchContext, SearchResult } from "./SearchContext";

export type TrackingContextType = {
  track: (searchResult: SearchResult) => void;
  unTrack: (SearchResult: SearchResult) => void;
};

export const TrackingContext = createContext<TrackingContextType>(null!);
TrackingContext.displayName = "TrackingContext";

export const TrackingContainer: React.FC<{}> = (props) => {
  const { refresh } = useContext(SearchContext);

  const track = useCallback(
    async (searchResult: SearchResult) => {
      await fetch(`/api/track`, {
        body: JSON.stringify(searchResult),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "post",
      });
      setTimeout(refresh, 1000);
    },
    [refresh],
  );

  const unTrack = useCallback(
    async ({ id }: SearchResult) => {
      await fetch(`/api/track/${id}`, { method: "delete" });
      setTimeout(refresh, 1000);
    },
    [refresh],
  );

  return (
    <>
      <TrackingContext.Provider
        value={{
          track,
          unTrack,
        }}
      >
        {props.children}
      </TrackingContext.Provider>
    </>
  );
};
