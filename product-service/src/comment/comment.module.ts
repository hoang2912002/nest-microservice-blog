import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ClientProxyModule } from 'src/clientModule';
import { RedisModule } from 'src/redis/redis.module';
import { CacheProxyModule } from 'src/cacheModule';

@Module({
  imports:[
    ClientProxyModule,
    RedisModule,
    CacheProxyModule
  ],
  providers: [CommentResolver, CommentService,PrismaService,UserService],
})
export class CommentModule {}
