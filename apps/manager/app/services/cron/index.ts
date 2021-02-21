import { Client } from "../../client";
import { Repository } from "../../repository/types";

export class CronService {
  constructor(private readonly deps: { repository: Repository; client: Client }) {}
}
