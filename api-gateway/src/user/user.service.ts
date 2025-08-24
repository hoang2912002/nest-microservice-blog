import { Inject, Injectable } from '@nestjs/common';
import { USER_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { UpdateUserDto, UpdateUserInfoDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

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

  async getAllAuthor(){
    return await lastValueFrom(this.userServiceClient.send("getAllAuthor",""))
  }

  async getAllUserTest({skip,take}:{
    skip:number,
    take:number
  }){
    return await lastValueFrom(this.userServiceClient.send("getAllUserTest",{skip,take}))
  }

  async createUser(createUserDto:CreateUserDto){
    return await lastValueFrom(this.userServiceClient.send("createUser_ByAdmin",createUserDto))
  }

  async updateUser(updateUserDto:UpdateUserInfoDto){
    return await lastValueFrom(this.userServiceClient.send("updateUser_ByAdmin",updateUserDto))
  }

  async deleteUser(input: string){
    return await lastValueFrom(this.userServiceClient.send("deleteUser_ByAdmin",input))
  }
}
