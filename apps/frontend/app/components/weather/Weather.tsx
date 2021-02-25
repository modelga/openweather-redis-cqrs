import { Grid } from "@material-ui/core";
import React from "react";

import { WeatherResult } from "../../contexts/WeatherContext";
import { WeatherBox } from "./WeatherBox";
import { WeatherHistoryBox } from "./WeatherHistoryBox";

export const Weather: React.FC<{ weather: WeatherResult }> = ({ weather }) => {
  const { current, history = [] } = weather;
  if (!current) {
    return <div>Error or noData</div>;
  }

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
