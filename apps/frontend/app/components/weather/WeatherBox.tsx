import React from "react";

import { Weather } from "../../contexts/WeatherContext";
import { kelvinToCelsius } from "../../utils";

export const WeatherBox: React.FC<{ weather: Weather }> = ({ weather }) => {
  return (
    <>
      <h4>{weather.name}</h4>
      <p> Temperature {kelvinToCelsius(weather.temperature)}</p>
      <p> Wind {weather.wind} m/s</p>
      <p> Humidity {weather.humidity} %</p>
      <p> Cloudiness {weather.cloudiness.toFixed(0)} %</p>
      <p>
        Rain {weather.rain.toFixed(0)} mm/m<sup>2</sup>
      </p>
    </>
  );
};
