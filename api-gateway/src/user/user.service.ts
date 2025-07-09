import { Inject, Injectable } from '@nestjs/common';
import { USER_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE)
    private userServiceClient: ClientProxy,
  ){}


  findOne(id: string) {
    return this.userServiceClient.send("findOneUser",id);
  }

  async login({username,password}:{username:string,password:string}){
    const dataRes = await lastValueFrom(this.userServiceClient.send("getUserBy_EmailPassword",{username,password}))
    return dataRes
  }

  async updateUserById({id,updateUserDto}:{id:string,updateUserDto:UpdateUserDto}){
    return await lastValueFrom(this.userServiceClient.send("updateUserById",{id,updateUserDto}))  
  }

  async deleteUserById(_id:string){
    return await lastValueFrom(this.userServiceClient.send("deleteUserById",_id));
  }

}
