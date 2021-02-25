import { Queue } from "../queue";

export class UpdateService {
  constructor(private readonly deps: { queue: Queue }) {}

  async forceUpdate(locationSlug: string) {
    const updatesCount = await this.deps.queue.publishUpdateRequest(locationSlug);
    if (!updatesCount) {
      throw new Error(`No listeners for location ${locationSlug}`);
    }
  }
}
