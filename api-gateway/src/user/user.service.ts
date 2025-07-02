import { Inject, Injectable } from '@nestjs/common';
import { USER_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

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


}
