import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ClientProxyModule } from 'src/clientModule';

@Module({
  imports:[ClientProxyModule],
  providers: [CommentResolver, CommentService,PrismaService,UserService],
})
export class CommentModule {}
