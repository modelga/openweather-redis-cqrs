import express from "express";
import { Config } from "../config";
import { Client, factory as clientFactory } from "./client";
import { factory as repositoryFactory, Repository } from "./repository";
import { factory as queueFactory, Queue } from "./queue";

import * as controllers from "./controllers";
import { SearchService, TrackService } from "./services";

export default function (config: Config) {
  const app = express();

  const { weatherService, trackService } = di(config);

  app.use("/search", controllers.searchController(weatherService));
  app.use("/track", controllers.trackController(trackService));

  return {
    start() {
      const { port } = config;
      app.listen(port, () => {
        console.log(`Manager (API) is listening on port ${port}`);
      });
    },
  };
}

function di(config: Config) {
  const client = clientFactory(config);
  const queue = queueFactory(config);
  const repository = repositoryFactory(config);

  const weatherService = new SearchService({ client, repository });
  const trackService = new TrackService({ client, repository });

  return { weatherService, trackService };
}
