import { Config } from "../config";
import { Client, factory as clientFactory } from "./client";
import { factory as repositoryFactory, Repository } from "./repository";
import { factory as queueFactory, Queue } from "./queue";

import { HistoryWeatherService, CurrentWeatherService, UpdateRequestService } from "./services";
import { TrackLocationService } from "./services/track";

function di(config: Config) {
  const client = clientFactory(config);
  const queue = queueFactory(config);
  const repository = repositoryFactory(config);
  return [
    new HistoryWeatherService({ queue, repository }),
    new CurrentWeatherService({ queue, repository }),
    new UpdateRequestService({ repository, client, queue }),
    new TrackLocationService({ repository, queue }),
  ];
}

export default function (config: Config) {
  const services = di(config);
  return {
    async start() {
      const started = await Promise.all(
        services.map(async (service) => {
          const events = service.listen();
          return {
            service,
            events: await (Array.isArray(events) ? Promise.all(events) : [await events]),
          };
        }),
      );

      console.log(`Consumer (Worker) is listening for events on ${services.length} services`);
      started.forEach(({ service, events }) => {
        console.log(service.constructor.name, "is listening on events", events);
      });
    },
  };
}
