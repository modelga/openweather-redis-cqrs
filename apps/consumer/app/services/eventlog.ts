import { Queue, RawMessage } from "../queue";
import { Repository } from "../repository";
import { ListeningInterface } from "./types";

export class EventLog implements ListeningInterface {
  constructor(private readonly deps: { repository: Repository; queue: Queue }) {}

  listen() {
    return this.deps.queue.listenToAnyMessage((message: RawMessage) => this.listenToAnyMessage(message));
  }

  async listenToAnyMessage(rawMessage: RawMessage) {
    const { repository } = this.deps;
    repository.updateEventLog(rawMessage);
  }
}
