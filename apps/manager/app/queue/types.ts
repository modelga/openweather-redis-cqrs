export enum QueueTypes {
  Redis,
}
export interface Queue {
  forceUpdate(locationSlug: string): Promise<void>;
}
