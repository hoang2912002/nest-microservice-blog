import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) 
    private userModule: Model<User>, 
  ){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    const data = await this.userModule.findById(id)
    return data;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
    const comparePass = await bcrypt.compare(password, userData.password)
    if(!comparePass) throw new UnauthorizedException("Email or password wrong")
    return userData
  }
}
