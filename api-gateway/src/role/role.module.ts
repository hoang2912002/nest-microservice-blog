import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { ClientProxyModule } from 'src/clientModule';

@Module({
  imports:[ClientProxyModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
