import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ClientProxyModule } from 'src/clientModule';

@Module({
  imports:[ClientProxyModule],
  providers: [LikeResolver, LikeService, PrismaService, UserService],
})
export class LikeModule {}
