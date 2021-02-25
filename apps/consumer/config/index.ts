import { Clients } from "../app/client";
import { PublisherTypes } from "../app/publisher";
import { QueueTypes } from "../app/queue/types";
import { DBTypes } from "../app/repository";

type ClientConfig = {
  type: Clients;
};
type RedisConnectionUri = `redis://${string}` | `rediss://${string}`;
export type OpenWeatherClient = ClientConfig & {
  type: Clients.Openweather;
  token: string;
  host: string;
};

export type Queue = {
  type: never;
};
export type RedisQueue = {
  type: QueueTypes.Redis;
  host: RedisConnectionUri;
};

export type Publisher = {
  type: never;
};
export type RedisPublisher = {
  type: PublisherTypes.Redis;
  host: RedisConnectionUri;
};

export type DB = {
  type: DBTypes;
};
export type RedisDB = DB & {
  type: DBTypes.Redis;
  host: RedisConnectionUri;
};
type Queues = Queue | RedisQueue;
type Publishers = Publisher | RedisPublisher;

export type Config = {
  client: OpenWeatherClient;
  queue: Queues;
  publisher: Publishers;
  db: RedisDB;
};

const config: Config = {
  client: {
    type: Clients.Openweather,
    token: process.env.OPENWEATHER_API_TOKEN,
    host: process.env.OPENWEATHER_API_URL,
  },
  queue: {
    type: QueueTypes.Redis,
    host: "redis://queue:6379",
  },
  publisher: {
    type: PublisherTypes.Redis,
    host: "redis://queue:6379",
  },
  db: {
    type: DBTypes.Redis,
    host: "redis://db:6379",
  },
};

export default config;
