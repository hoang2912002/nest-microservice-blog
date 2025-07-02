import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/decorator/customize';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Get('getById')
  findOne(@Query('id') id: string) {
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
}
