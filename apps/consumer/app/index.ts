import { Config } from "../config";
import { factory as clientFactory } from "./client";
import { factory as queueFactory } from "./queue";
import { factory as repositoryFactory } from "./repository";
import { factory as publisherFactory } from "./publisher";
import { CurrentWeatherService, HistoryWeatherService, UpdateRequestService, SchedulerService } from "./services";
import { EventLog } from "./services/eventlog";
import { TrackLocationService } from "./services/track";

function di(config: Config) {
  const client = clientFactory(config);
  const queue = queueFactory(config);
  const repository = repositoryFactory(config);
  const publisher = publisherFactory(config);
  return [
    new EventLog({ repository, queue }),
    new UpdateRequestService({ repository, client, queue, publisher }),
    new TrackLocationService({ repository, queue, publisher }),
    new HistoryWeatherService({ queue, repository }),
    new CurrentWeatherService({ queue, repository }),
    new SchedulerService({ queue, repository, publisher, config }),
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
