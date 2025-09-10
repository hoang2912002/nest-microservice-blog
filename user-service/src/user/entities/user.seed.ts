// src/user/user.seed.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Role, RoleDocument } from 'src/role/entities/role.entity';
import { ACCOUNT_TYPE, ROLE_SLUG } from 'src/constants';
import { User_Test, UserTestDocument } from 'src/user-test/entities/user-test.entity';
const saltRounds = 10;
@Injectable()
export class UserSeeder {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User_Test.name) private userTestModel: Model<UserTestDocument>,
) {}

  async seed(count = 100000) {
    // const roles = await this.roleModel.insertMany([
    //     { 
    //         name: 'user',
    //         slug: ROLE_SLUG.USER
    //     },
    //     { 
    //         name: 'admin',
    //         slug: ROLE_SLUG.ADMIN
    //     },
    // ]);
    const roles = await this.roleModel.find();
    console.log({roles})
    const userRole = roles.find(r => r.slug === ROLE_SLUG.USER);
    const users: Partial<User>[] = [];
    for (let i = 0; i < count; i++) {
      users.push({
        name: faker.person.fullName(),
        gender: faker.datatype.boolean(),
        email: faker.internet.email(),
        password: "$2b$10$KETkl5T8nRqiusCaXJdu2uC88STzdiGetAWp1MuwM7v3tTYakjmPu",
        avatar: faker.image.avatar(),
        roleId: userRole?.slug,
        accountType:ACCOUNT_TYPE.LOCAL,
        isActive:false,
        codeId:undefined,
        codeExpired: undefined
      });
    }
    console.log({users}, count)
    await this.userModel.insertMany(users);
    console.log(`✅ Seeded ${count} fake users`);
  }
}
