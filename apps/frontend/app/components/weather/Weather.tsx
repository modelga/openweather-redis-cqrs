import React, { useContext } from "react";
import { Grid } from "@material-ui/core";
import { WeatherContext } from "../../contexts/WeatherContext";
import { TrackingContext } from "../../contexts/TrackingContext";
import { WeatherBox } from "./WeatherBox";
import { WeatherHistoryBox } from "./WeatherHistoryBox";
export const WeatherData: React.FC<{}> = () => {
  const { result } = useContext(WeatherContext);

  if (result.error) {
    return <div>Error during retrieving data</div>;
  }
  if (!result?.data?.current) {
    return <div>No weather data data</div>;
  }

  const { current, history } = result.data;
  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <WeatherBox weather={current} />
      </Grid>
      <Grid item xl>
        History:
        {history.map((entry, index) => (
          <WeatherHistoryBox entry={entry} key={index} />
        ))}
      </Grid>
    </Grid>
  );
};

export const Weather: React.FC<{}> = () => {
  const { result: trackingResult } = useContext(TrackingContext);

  if (!trackingResult.data) {
    return null;
  }
  return (
    <div>
      <WeatherData />
    </div>
  );
};
