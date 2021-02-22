import express from "express";
import { Config } from "../config";
import { factory as clientFactory } from "./client";
import { factory as repositoryFactory } from "./repository";
import { factory as queueFactory } from "./queue";

import * as controllers from "./controllers";
import { SearchService, TrackService, WeatherService, UpdateService } from "./services";

function di(config: Config) {
  const client = clientFactory(config);
  const queue = queueFactory(config);
  const repository = repositoryFactory(config);

  const searchService = new SearchService({ client });
  const trackService = new TrackService({ client, repository });
  const weatherService = new WeatherService({ repository });
  const updateService = new UpdateService({ queue });

  return { searchService, trackService, weatherService, updateService };
}

export default function (config: Config) {
  const app = express();

  const { searchService, trackService, weatherService, updateService } = di(config);

  app.use("/search", controllers.searchController(searchService));
  app.use("/track", controllers.trackController(trackService));
  app.use("/update", controllers.updateController(updateService));
  app.use("/weather", controllers.weatherController(weatherService));

  return {
    start() {
      const { port } = config;
      app.listen(port, () => {
        console.log(`Manager (API) is listening on port ${port}`);
      });
    },
  };
}
