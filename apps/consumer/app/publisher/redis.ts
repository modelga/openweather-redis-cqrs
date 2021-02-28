import IoRedis from "ioredis";

import { Weather } from "../models";
import { Topics as Topic } from "../topics";
import { Publisher } from "./types";

export class RedisPublisher implements Publisher {
  private publisher: IoRedis.Redis;

  constructor(host: string) {
    this.publisher = new IoRedis(host);
  }
  publishToTopic(topic: Topic, message: any) {
    return this.publish(topic, typeof message === "object" ? JSON.parse(message) : message.toString());
  }

  publishWeatherData(weather: Weather) {
    return this.publish(Topic.WEATHER_UPDATED_CHANNEL, JSON.stringify(weather));
  }

  publishUpdateRequest(locationId: string) {
    return this.publish(Topic.UPDATE_REQUEST_CHANNEL, locationId);
  }

  private async publish(channel: Topic, message: string): Promise<void> {
    const consumers = await this.publisher.publish(channel, message);
    const { length } = message;
    console.log(
      `Message of ${length} bytes, has been published on channel ${channel} to ${consumers} consumers ${
        length < 25 ? `value=${message}` : ""
      }`,
    );
    return;
  }
}
