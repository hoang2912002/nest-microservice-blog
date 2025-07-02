import { Inject, Injectable } from '@nestjs/common';
import { USER_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
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
    return await firstValueFrom(this.userServiceClient.send("getUserBy_EmailPassword",{username,password}))
  }

  async updateUserById({id,updateUserDto}:{id:string,updateUserDto:UpdateUserDto}){
    return await firstValueFrom(this.userServiceClient.send("updateUserById",{id,updateUserDto}))  
  }

  async deleteUserById(_id:string){
    return await firstValueFrom(this.userServiceClient.send("deleteUserById",_id));
  }

}
