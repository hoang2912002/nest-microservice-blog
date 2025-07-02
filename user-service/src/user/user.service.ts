import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, SignUpDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ROLE_SLUG } from 'src/constants';
import { checkMongoIdValid, comparePassword, convertPassword } from 'src/util/helper';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs'
@Injectable()
export class UserService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(User.name) 
    private userModule: Model<User>, 
  ){}

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    const data = await this.userModule.findById(id)
    return data;
  }

  async update({id,updateUserDto}:{id: string, updateUserDto: UpdateUserDto}) {
    const {name,email,gender,avatar} = updateUserDto
    const checkEmail = await this.isEmailExist(email,id);
    if(checkEmail){
      throw new Error(`Email ${email} đã tồn tại`)
    }
    const queryUpdate: any = {
      name,
      email,
      gender,
    }
    
    if (updateUserDto.password?.trim()) {
      queryUpdate.password = updateUserDto.password;
    }

    if (avatar?.trim()) {
      queryUpdate.avatar = avatar;
    }

    const updatedUser = await this.userModule.findByIdAndUpdate(
      id,
      queryUpdate,
      { new: true }
    );

    if (!updatedUser) {
      throw new Error(`Không tìm thấy user với id ${id}`);
    }
    const { password, ...dataRes } = updatedUser.toObject();
    return dataRes;
  }

  async deleteUserById(_id: string) {
    if(!checkMongoIdValid(_id)){
      throw new BadRequestException("Invalid id")
    }
    const result =  await this.userModule.deleteOne({_id})
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with id ${_id} not found`);
    }

    return { message: `User with id ${_id} deleted successfully` };
    
  }

  async getUserBy_EmailPassword({username,password}:{
    username:string,
    password:string
  })
  { 
    const userData = await this.userModule.findOne({
      email:username
    })
    if(!userData) throw new UnauthorizedException("Email not exist")
    const comparePass = await comparePassword(password, userData.password)
    if(!comparePass) throw new UnauthorizedException("Email or password wrong")
    return userData
  }
  isEmailExist = async (email: string,id?: string): Promise<boolean> => {
    const query: any = { email };

    if (id) {
      query._id = { $ne: id }; 
    }
    const isExist = await this.userModule.exists(query)
    return !!isExist;
  }
  async signUp(signUpDto:SignUpDto){
    const {name,email,password,gender,avatar} = signUpDto
    const checkUser = await this.isEmailExist(email)
    if(checkUser){
      throw new Error("Email người dùng đã tồn tại")
    }
    const hashPassword = await convertPassword(password);
    const codeId = uuidv4();
    const data = await this.userModule.create({
      name,
      email,
      gender,
      password:hashPassword,
      avatar,
      roleId:ROLE_SLUG.USER,
      codeId,
      isActive:false,
      codeExpired:dayjs().add(5,'minutes')
    })
    this.mailerService
      .sendMail({
        to: data?.email,
        subject: 'Activated your account at @Next-nestjs',
        template: 'register_mail',
        context:{
          name: data?.name,
          codeId
        }
      }) 
    return {
      _id: data.id
    };
  }
  
}
