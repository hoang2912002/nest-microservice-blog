// redis.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    this.publisher = new Redis(redisUrl);
    this.subscriber = new Redis(redisUrl);
  }

  publish(channel: string, message: string) {
    console.log('Socket connect')
    return this.publisher.publish(channel, message);
  }

  getSubscriberClient() {
    console.log('Socket connect')
    return this.subscriber;
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
