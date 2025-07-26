import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { ClientProxyModule } from 'src/clientModule';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[ClientProxyModule],
  providers: [NotificationResolver, NotificationService,PrismaService,UserService],
  exports:[NotificationService]
})
export class NotificationModule {}
