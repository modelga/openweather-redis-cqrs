import { DetailedLocationWithId } from "../models";

export enum QueueTypes {
  Redis,
}
export interface Queue {
  publishUpdateRequest(locationId: string): Promise<boolean>;

  publishTrackLocation(location: DetailedLocationWithId): Promise<boolean>;

  publishUntrackLocation(locationId: string): Promise<boolean>;
}
