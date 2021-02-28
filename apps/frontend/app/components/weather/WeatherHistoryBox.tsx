import React from "react";

import { HistoryWeather } from "../../contexts/WeatherContext";
import { kelvinToCelsius } from "../../utils";

export const WeatherHistoryBox: React.FC<{ entry: HistoryWeather }> = ({ entry }) => {
  const date = new Date(entry.timestamp);
  return (
    <div>
      T: {kelvinToCelsius(entry.temperature)} ({date.toLocaleDateString()} {date.toLocaleTimeString()})
    </div>
  );
};
