import { Config } from "../config";
import { Client, factory as clientFactory } from "./client";
import { factory as repositoryFactory, Repository } from "./repository";
import { factory as queueFactory, Queue } from "./queue";

import { HistoryWeatherService, CurrentWeatherService, UpdateRequestService } from "./services";

function di(config: Config) {
  const client = clientFactory(config);
  const queue = queueFactory(config);
  const repository = repositoryFactory(config);
  return [
    new HistoryWeatherService({ queue, repository }),
    new CurrentWeatherService({ queue, repository }),
    new UpdateRequestService({ repository, client, queue }),
  ];
}

export default function (config: Config) {
  const services = di(config);
  return {
    start() {
      services.forEach((service) => service.listen());
      console.log(`Consumer (API) is listening for events on ${services.length} services`);
    },
  };
}
