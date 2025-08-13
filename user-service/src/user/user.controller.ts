import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, SignInGoogleDto, SignUpDto, VerifyTokenDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('findAll')
  async findAll() {
    return await this.userService.findAll();
  }
  //List arr _id
  @MessagePattern('findAllArrId')
  async findAllArrId() {
    return await this.userService.findAllArrId();
  }
  
  @MessagePattern('findAllArrName')
  async findAllArrName() {
    return await this.userService.findAllArrName();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }


  @MessagePattern('getUserBy_EmailPassword')
  async wgetUserBy_EmailPassword(@Payload() user:{username:string,password:string}) {
    return await this.userService.getUserBy_EmailPassword({
      username: user.username,
      password:user.password});
  }

  @MessagePattern("signUp")
  async signUp(@Payload() signUpDto:SignUpDto){
    return await this.userService.signUp(signUpDto);
  }

  @MessagePattern("updateUserById")
  async updateUserById(@Payload() userData:{id:string,updateUserDto:UpdateUserDto}){
    return await this.userService.update({id:userData.id, updateUserDto:userData.updateUserDto});
  }

  @MessagePattern("deleteUserById")
  async deleteUserById(@Payload() _id:string){
    return await this.userService.deleteUserById(_id)
  }

  @MessagePattern("verifyToken")
  async verifyToken(@Payload() verifyTokenDto:VerifyTokenDto){
    return await this.userService.verifyToken(verifyTokenDto)
  }

  @MessagePattern("resendVerifyToken")
  async resendVerifyToken(@Payload() _id:string){
    return await this.userService.resendVerifyToken(_id)
  }

  @MessagePattern('ping')
  ping() {
    return 'pong from user-service';
  }


  //-----------------Product service-----------------------
  @MessagePattern('getUser_ById_FromPost')
  async getUser_ById_FromPost(@Payload() _id:string){
    return this.userService.getUser_ById_FromPost(_id)
  }

  @MessagePattern("checkUserGoogle")
  async checkUserGoogle(@Payload() signInGoogleDto: SignInGoogleDto){
    return this.userService.checkUserGoogle(signInGoogleDto)
  }


  //-----------------Admin---------------------------------
  @MessagePattern("getAllAuthor")
  async getAllAuthor(){
    return await this.userService.getAllAuthor()
  }

  @MessagePattern("getAllAdminList")
  async getAllAdminList(){
    return await this.userService.getAllAdminList()
  }
}
