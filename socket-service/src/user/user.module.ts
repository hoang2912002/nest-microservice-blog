import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientProxyModule } from 'src/clientModule';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports:[RedisModule,ClientProxyModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
