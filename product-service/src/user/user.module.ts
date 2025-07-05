import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientProxyModule } from 'src/clientModule';

@Module({
  imports:[ClientProxyModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
