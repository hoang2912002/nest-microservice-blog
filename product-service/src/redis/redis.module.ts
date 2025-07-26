import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisGateway } from './redis.gateway';
import { ClientProxyModule } from 'src/clientModule';

@Module({
  imports:[ClientProxyModule],
  providers: [RedisGateway, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
