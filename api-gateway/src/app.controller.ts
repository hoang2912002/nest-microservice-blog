import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { USER_SERVICE } from './constants';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject(USER_SERVICE)
    private userServiceClient: ClientProxy,
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("profile")
  getProfile(@Query() user:{name:string,email:string}){
    const res = this.userServiceClient.send("profile",user)
    console.log("Res: ", res)
    return res
  }
}
