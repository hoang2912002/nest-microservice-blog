import { Module } from '@nestjs/common';
import { UserTestService } from './user-test.service';
import { UserTestController } from './user-test.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { Role, RoleSchema } from 'src/role/entities/role.entity';
import { User_Test, UserTestSchema } from './entities/user-test.entity';
import { ClientProxyModule } from 'src/clientModule';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: User_Test.name, schema: UserTestSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    ClientProxyModule
  ],
  controllers: [UserTestController],
  providers: [UserTestService, UserService],
})
export class UserTestModule {}
