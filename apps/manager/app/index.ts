import bodyParser from "body-parser";
import express from "express";

import { Config } from "../config";
import { factory as clientFactory } from "./client";
import * as controllers from "./controllers";
import { factory as queueFactory } from "./queue";
import { factory as repositoryFactory } from "./repository";
import { SearchService, TrackService, UpdateService, WeatherService } from "./services";

function di(config: Config) {
  const client = clientFactory(config);
  const queue = queueFactory(config);
  const repository = repositoryFactory(config);

  const trackService = new TrackService({ repository, queue });
  const searchService = new SearchService({ client, trackService });
  const weatherService = new WeatherService({ repository });
  const updateService = new UpdateService({ queue });

  return { searchService, trackService, weatherService, updateService };
}

export default function (config: Config) {
  const app = express();
  app.use(bodyParser.json());

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
