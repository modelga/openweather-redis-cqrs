import { Queue } from "../queue";

export class UpdateService {
  constructor(private readonly deps: { queue: Queue }) {}

  async forceUpdate(locationSlug: string) {
    const updatesCount = await this.deps.queue.forceUpdate(locationSlug);
    if (updatesCount === 0) {
      throw new Error(`No listeners for location ${locationSlug}`);
    }
  }
}
