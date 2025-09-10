import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSeeder } from './entities/user.seed';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Role, RoleSchema } from 'src/role/entities/role.entity';
import { ClientProxyModule } from 'src/clientModule';
import { UserTestModule } from 'src/user-test/user-test.module';
import { User_Test, UserTestSchema } from 'src/user-test/entities/user-test.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User_Test.name, schema: UserTestSchema },
    ]),
    UserTestModule,
    ClientProxyModule,
    CacheModule.register(),
  ],
  controllers: [UserController,UserSeeder],
  providers: [UserService,UserSeeder],
  exports:[UserService]
})
export class UserModule {}
