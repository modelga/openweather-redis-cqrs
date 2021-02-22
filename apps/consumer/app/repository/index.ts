import { Config } from "../../config";
import { RedisRepository } from "./redis";
import { Repository, DBTypes } from "./types";
export * from "./types";

export function factory(config: Config): Repository {
  switch (config.db.type) {
    case DBTypes.Redis:
      return new RedisRepository(config);
    default:
      throw new Error(`Not found repository for specified for type ${config.client.type}`);
  }
}
