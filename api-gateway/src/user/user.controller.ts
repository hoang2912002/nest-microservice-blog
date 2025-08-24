import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/decorator/customize';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Get('getById')
  findOne(
    @Query('id') id: string
  ) {
    return this.userService.findOne(id);
  }

  @Patch("update")
  updateUserById(
    @Query('id') id: string,
    @Body() updateUserDto:UpdateUserDto){
    return this.userService.updateUserById({id,updateUserDto})
  }
  
  @Delete('delete/:_id')
  async remove(@Param('_id') _id: string){
    return await this.userService.deleteUserById(_id)
  }

  @Get('getAllAuthor')
  getAllAuthor(){
    return this.userService.getAllAuthor()
  }

  @Post("getAllUserTest")
  getAllUserTest(
    @Body('query') query: any,
  ){
    const {skip,take} = query
    return this.userService.getAllUserTest({skip,take})
  }

  @Post("createUser_ByAdmin")
  createUser(
    @Body("query") query: any
  ) {
    return this.userService.createUser(query.input)
  }

  @Post("updateUser_ByAdmin")
  updateUser(
    @Body("query") query: any
  ){
    return this.userService.updateUser(query.input)
  }

  @Post("deleteUser_ByAdmin")
  deleteUser_ByAdmin(
    @Body() body: any
  ){
    return this.userService.deleteUser(body?.query.input)
  }
}