import { BadRequestException, HttpStatus, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import { SignUpDto, VerifyTokenDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PRODUCT_SERVICE, ROLE_SLUG } from 'src/constants';
import { checkMongoIdValid, comparePassword, convertPassword, errorResponse, successResponse } from 'src/util/helper';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs'
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class UserService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(User.name) 
    private userModule: Model<User>, 
    @Inject(PRODUCT_SERVICE)
    private readonly productService:ClientProxy
  ){}
  // async onModuleInit(): Promise<void> {
  //   try {
  //     await this.productService.connect();
  //     const response = await this.productService.send('ping_product', {}).toPromise();
  //     console.log('Ping result:', response);
  //   } catch (error) {
  //     console.error('Error pinging user service:', error.message || error);
  //   }
  // }

  async findAll() {
    const user =  await this.userModule.find();
    return successResponse(user, 'Danh sách thông tin người dùng!');
  }
  
  async findAllArrId() {
    const user =  await this.userModule.find().select('_id');
    const ids = user.map(u => u._id.toString());
    return successResponse(ids, 'Danh sách thông tin _id người dùng!');
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
      // throw new Error(`Không tìm thấy user với id ${id}`);
      return errorResponse(`Không tìm thấy người dùng: ${id}`, HttpStatus.NOT_FOUND)
    }
    const { password, ...dataRes } = updatedUser.toObject();
    return successResponse(dataRes, 'Cập nhật thông tin người dùng thành công!');
;
  }

  async deleteUserById(_id: string) {
    if(!checkMongoIdValid(_id)){
      return errorResponse(`Mã người dùng sai: ${_id}`, HttpStatus.NOT_FOUND)
    }
    const result =  await this.userModule.deleteOne({_id})
    if (result.deletedCount === 0) {
      return errorResponse(`Xóa người dùng id: ${_id}`, HttpStatus.NOT_FOUND)
    }
    return successResponse(result, `Xóa thông tin người dùng id: ${_id} thành công!`);
  }

  async getUserBy_EmailPassword({username,password}:{
    username:string,
    password:string
  })
  { 
    const userData = await this.userModule.findOne({
      email:username
    })
    if(!userData) return errorResponse(`Email không tồn tại/ không đúng: ${username}`, HttpStatus.NOT_FOUND)
    const comparePass = await comparePassword(password, userData.password)
    if(!comparePass) return errorResponse(`Mật khẩu/ tài khoảng không đúng!`, HttpStatus.NOT_FOUND)
    return successResponse(userData, `Đăng nhập thành công!`);
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
      return errorResponse(`Email: ${email} đã tồn tại!`, HttpStatus.NOT_FOUND)
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
    return successResponse(data._id, `Đăng ký tài khoản thành công!`);
  }

  async verifyToken(verifyTokenDto:VerifyTokenDto){
    try {
      const {_id,codeId} = verifyTokenDto;
      const user  =  await this.userModule.findOne({
        _id,
        codeId
      })
      if(!user){
        return errorResponse(`Mã kích hoạt không đúng!`, HttpStatus.NOT_FOUND)
      }
      const isBeforeCheck = dayjs().isBefore(user.codeExpired)
      if(!isBeforeCheck){
        return errorResponse(`Mã kích hoạt đã hết hạn, vui lòng thử lại!`, HttpStatus.NOT_FOUND)
      }
      else{
        await this.userModule.updateOne({_id},{
          isActive:true
        },{new: true})
        return successResponse(_id, `Kích hoạt tài khoàn thành công!`)
    }
    } catch (error) {
      return errorResponse(`Lỗi máy chủ!`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
  async resendVerifyToken(_id:string){
    try {
      if(!checkMongoIdValid(_id)){
        return errorResponse(`Mã người dùng sai: ${_id}`, HttpStatus.NOT_FOUND)
      }
      const user = await this.userModule.findById({_id:Object(_id)});
      if(!user){
        return errorResponse(`Người dùng không tồn tại!`, HttpStatus.NOT_FOUND)
      }
      const codeId = uuidv4()
      const userUpdate = await this.userModule.findByIdAndUpdate(
        {
          _id:Object(_id)
        },
        {
          codeId,
          codeExpired:dayjs().add(5,'minutes')  
        },
        {
          new:true
        }
      )
      this.mailerService
      .sendMail({
        to: user?.email,
        subject: 'Activated your account at @Next-nestjs',
        template: 'verify_code',
        context:{
          name: user?.name,
          codeId
        }
      }) 
      return successResponse(user?._id, `Gửi mã xác thực thành công!`);
    } catch (error) {
      return errorResponse(`Lỗi máy chủ!`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
