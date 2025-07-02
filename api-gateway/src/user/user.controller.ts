import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/decorator/customize';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Get('getById')
  findOne(@Query('id') id: string) {
    return this.userService.findOne(id);
  }

  
}
