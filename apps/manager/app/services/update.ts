import { Queue } from "../queue";

export class UpdateService {
  constructor(private readonly deps: { queue: Queue }) {}
}
