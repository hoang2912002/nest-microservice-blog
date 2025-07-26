import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    this.publisher = new Redis(url);
    this.subscriber = new Redis(url);
  }

  publish(channel: string, payload: any) {
    return this.publisher.publish(channel, JSON.stringify(payload));
  }

  subscribe(channel: string, listener: (message: any) => void) {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        listener(JSON.parse(msg));
      }
    });
  }
}
