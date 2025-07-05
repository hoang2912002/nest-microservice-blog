import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { errorResponse, successResponse } from 'src/util/helper';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE)
    private userClient: ClientProxy
  ){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    try {
      return  await this.userClient.send("findAll",{}).toPromise()
    } catch (error) {
      return errorResponse(`Lỗi máy chủ!`, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
