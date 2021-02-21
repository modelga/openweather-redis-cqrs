import { Client } from "../client";
import { Repository } from "../repository/types";
import { slugify } from "../utils";

export class SearchService {
  constructor(private readonly deps: { repository: Repository; client: Client }) {}
  async queryForLocation(loc: string) {
    const name = await this.deps.client.queryForLocation(loc);
    if (!name) {
      return undefined;
    }
    return { name, slug: slugify(name) };
  }
}
