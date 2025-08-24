import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserTestDto } from './dto/create-user-test.dto';
import { UpdateUserTestDto } from './dto/update-user-test.dto';
import { Model } from 'mongoose';
import { User_Test, UserTestDocument } from './entities/user-test.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { errorResponse } from 'src/util/helper';

@Injectable()
export class UserTestService implements OnModuleInit {
  constructor(
    @InjectModel(User_Test.name) 
    private readonly userTestModel: Model<UserTestDocument>,
    private readonly userService: UserService
  ) {}
  async onModuleInit() {
    // Đồng bộ index khi app start
    // await this.userTestModel.syncIndexes();
    // console.log('✅ UserTest indexes synced');
  }


  async getAllUserTest({
    skip,
    take
  }:{
    skip: number,
    take: number
  }){
    const dataQuery = await this.userTestModel.aggregate([
      { $sort: { _id: 1 } },
      { $skip: skip },
      { $limit: take },
      {
        $lookup: {
          from: "roles",
          localField: "roleId",
          foreignField: "slug",
          as: "roleInfo"
        }
      },
      {
        $unwind: "$roleInfo"
      },
      {
        $project: {
          _id: 1,
          name: 1,
          gender: 1,
          email:1,
          avatar: 1,
          roleId: 1,
          accountType: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          roleInfo: 1,
        }
      }
    ]);
    //Đếm toàn bộ số bản ghi theo metadata
    const countQuery = this.userTestModel.estimatedDocumentCount()
    const [getAllUserList_ByAdmin, countAllUserList_ByAdmin] = await Promise.all([
      dataQuery,countQuery
    ])
    //.explain("executionStats");
    // // step 1: lấy danh sách id theo sort + skip + limit
    // const ids = await this.userTestModel.find()
    //   .sort({ _id: -1 })
    //   .skip(skip)
    //   .limit(take)
    //   .select({ _id: 1 })
    //   .lean();

    // // step 2: query lại để lấy full document + join
    // const data = await this.userTestModel.aggregate([
    //   { $match: { _id: { $in: ids.map(i => i._id) } } },
    //   {
    //     $lookup: {
    //       from: "roles",
    //       localField: "roleId",
    //       foreignField: "slug",
    //       as: "roleInfo"
    //     }
    //   },
    //   { $project: { 
    //     _id: 1,
    //     name: 1,
    //     gender: 1,
    //     password: 1,
    //     avatar: 1,
    //     roleId: 1,
    //     accountType: 1,
    //     isActive: 1,
    //     createdAt: 1,
    //     updatedAt: 1,
    //     roleInfo: 1,
    //    } }
    // ]);


    return {
      data: {
        getAllUserList_ByAdmin,
        countAllUserList_ByAdmin
      },
      errorField: null
    }
  }
  async clearPlanCache() {
    // const collection: any = this.userTestModel.collection;
    // await collection.getPlanCache().clear();
    // return { message: '✅ Plan cache cleared' };
  }

  create(createUserTestDto: CreateUserTestDto) {
    return 'This action adds a new userTest';
  }

  findAll() {
    return `This action returns all userTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userTest`;
  }

  update(id: number, updateUserTestDto: UpdateUserTestDto) {
    return `This action updates a #${id} userTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} userTest`;
  }
}
