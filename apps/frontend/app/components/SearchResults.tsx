import { Button, Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";

import { SearchContext, SearchResult } from "../contexts/SearchContext";
import { TrackingContext } from "../contexts/TrackingContext";
import { WeatherContext, WeatherResult } from "../contexts/WeatherContext";
import { Weather } from "./weather/Weather";

const ResultComponent: React.FC<{ data: SearchResult }> = ({ data }) => {
  const { track, unTrack } = useContext(TrackingContext);
  const { get, update } = useContext(WeatherContext);
  const [weather, setWeather] = useState<WeatherResult>({ current: null, history: [] });

  useEffect(() => {
    (async () => {
      setWeather(await get(data));
    })();
  }, [setWeather, data]);

  const trackAction = data.isTracked ? unTrack : track;
  return (
    <div>
      <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={3}>
        <Grid item xs>
          {data.name}, {data.state && `${data.state} ,`} {data.country} [{data.lat}, {data.lon}]
          {data.isTracked && <Weather weather={weather} />}
        </Grid>
        <Grid item xs={4}>
          <Button color="primary" variant="contained" onClick={() => trackAction(data)}>
            {data.isTracked ? "Remove" : "Add"}
          </Button>
        </Grid>
        {data.isTracked ? (
          <Grid item xs={4}>
            <Button color="secondary" variant="contained" onClick={() => refresh(data)}>
              Refresh
            </Button>
            <Button color="secondary" variant="contained" onClick={() => update(data)}>
              Update
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
};
export const SearchResults: React.FC<{}> = () => {
  const { searchResult } = useContext(SearchContext);
  return (
    <>
      {searchResult.map((result) => (
        <ResultComponent key={result.id} data={result} />
      ))}
    </>
  );
};
