import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { NotificationGateway } from './notification.gateway';

@Module({
    imports:[RedisModule],
    providers:[NotificationGateway]
})
export class NotificationModule {}
