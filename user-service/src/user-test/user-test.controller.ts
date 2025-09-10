import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserTestService } from './user-test.service';
import { CreateUserTestDto } from './dto/create-user-test.dto';
import { UpdateUserTestDto } from './dto/update-user-test.dto';

@Controller()
export class UserTestController {
  constructor(private readonly userTestService: UserTestService) {}

  @MessagePattern("getAllUserTest")
  getAllUserTest(
    @Payload() limitData: any,
  ){
    return this.userTestService.getAllUserTest({
      skip:parseInt(limitData.skip),
      take: parseInt(limitData.take),
      cursor:limitData.cursor
      
    })
  }

  @MessagePattern('createUserTest')
  create(@Payload() createUserTestDto: CreateUserTestDto) {
    return this.userTestService.create(createUserTestDto);
  }

  @MessagePattern('findAllUserTest')
  findAll() {
    return this.userTestService.findAll();
  }

  @MessagePattern('findOneUserTest')
  findOne(@Payload() id: number) {
    return this.userTestService.findOne(id);
  }

  @MessagePattern('updateUserTest')
  update(@Payload() updateUserTestDto: UpdateUserTestDto) {
    return this.userTestService.update(updateUserTestDto.id, updateUserTestDto);
  }

  @MessagePattern('removeUserTest')
  remove(@Payload() id: number) {
    return this.userTestService.remove(id);
  }
}
