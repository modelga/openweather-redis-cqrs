import express from "express";
import { Config } from "../config";
import { factory as clientFactory } from "./client";
import { factory as repositoryFactory } from "./repository";
import * as controllers from "./controllers";
import { WeatherService } from "./services/weather/index";

export default function (config: Config) {
  const app = express();
  const client = clientFactory(config);
  const repository = repositoryFactory(config);
  const weatherService = new WeatherService({ client, repository });

  app.use("/search", controllers.searchController(weatherService));

  return {
    start() {
      const { port } = config;
      app.listen(port, () => {
        console.log(`Manager (API) is listening on port ${port}`);
      });
    },
  };
}
