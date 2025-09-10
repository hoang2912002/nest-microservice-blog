import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { errorResponse, successResponse } from 'src/util/helper';
import { User } from './entities/user.entity';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE)
    private userClient: ClientProxy
  ){}
 
  async findAll() {
    try {
      return  await this.userClient.send("findAll",{}).toPromise()
    } catch (error) {
      return errorResponse(`Lỗi máy chủ!`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getUserById(authorId:string){
    try {
      const user =  await firstValueFrom(this.userClient.send('getUser_ById_FromPost',authorId))
      return user
    } catch (error) { 
      throw new Error("Không thể kết nối đến User-service")
    }
  }
}
