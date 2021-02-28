import { Config } from "../../config";
import { DetailedLocation, SchedulerState } from "../models";
import { Publisher } from "../publisher";
import { Queue } from "../queue";
import { Repository } from "../repository";
import { ListeningInterface } from "./types";

export class SchedulerService implements ListeningInterface {
  private state: Record<string, SchedulerState> = {};
  private toRemove: string[] = [];

  constructor(private readonly deps: { config: Config; repository: Repository; queue: Queue; publisher: Publisher }) {
    const { enabled } = this.deps.config.scheduler;
    if (enabled) {
      this.syncronize().then(() => this.scheduler());
    }
  }

  listen() {
    const { queue } = this.deps;
    return [
      queue.listenToTrackLocation((weather: DetailedLocation) => this.listenToTrackLocation(weather)),
      queue.listenToUntrackLocation((weather: string) => this.listenToUnTrackLocation(weather)),
    ];
  }

  private async syncronize() {
    const { repository } = this.deps;
    const allLocations = await repository.getAllTrackingLocations();
    const state = await repository.getSchedulerState();
    allLocations.forEach((locationId) => {
      if (!state[locationId]) {
        state[locationId] = { lastRun: 0 };
      }
    });
    this.state = state;
  }

  private async scheduler() {
    try {
      this.cleanupStateWithToRemoveElements();
      const now = Date.now();
      const updateStateEntries = await this.publishEvents(now);
      await this.updateStateElements(updateStateEntries, now);
      this.updateLocalState(updateStateEntries, now);
    } catch (e) {
      console.error("Failed to update events", e);
    } finally {
      const { tick } = this.deps.config.scheduler;
      setTimeout(() => this.scheduler(), tick);
    }
  }

  private updateLocalState(updateStateEntries: string[], now: number) {
    this.state = updateStateEntries.reduce((acc, locationId) => {
      acc[locationId] = { lastRun: now };
      return acc;
    }, this.state);
  }

  private async updateStateElements(updateStateEntries: string[], now: number) {
    const { repository } = this.deps;

    await Promise.all(
      updateStateEntries.map((locationId) => {
        return repository.updateSchedulerField(locationId, { lastRun: now });
      }),
    );
  }

  private async publishEvents(now: number) {
    const { publisher } = this.deps;
    const { interval } = this.deps.config.scheduler;
    const { updatesPerTick } = this.deps.config.scheduler;
    const lastRunBeforeInterval = ([_, { lastRun }]: [any, SchedulerState]) => {
      return lastRun < now - interval;
    };
    const takeElementsToUpdate = (_: any, index: number) => {
      return index < updatesPerTick;
    };
    const updateStateEntries = await Promise.all(
      Object.entries(this.state)
        .sort(([a], [b]) => a.localeCompare(b))
        .filter(lastRunBeforeInterval)
        .filter(takeElementsToUpdate)
        .map(async ([locationId]) => {
          publisher.publishUpdateRequest(locationId);
          return locationId;
        }),
    );
    return updateStateEntries;
  }

  private cleanupStateWithToRemoveElements() {
    let t;
    while ((t = this.toRemove.pop())) {
      delete this.state[t];
    }
  }

  async listenToTrackLocation(weather: DetailedLocation) {
    const { repository } = this.deps;
    const { id } = weather;
    await repository.updateSchedulerField(id, { lastRun: 0 });
    this.state[id] = { lastRun: 0 };
  }

  async listenToUnTrackLocation(locationId: string) {
    const { repository } = this.deps;
    await repository.removeSchedulerField(locationId);
    this.toRemove.push(locationId);
  }
}
