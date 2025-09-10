import { BadRequestException, HttpStatus, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import { CreateUserDto, SignInGoogleDto, SignUpDto, VerifyTokenDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserInfoDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import mongoose, { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PRODUCT_SERVICE, ROLE_SLUG } from 'src/constants';
import { checkMongoIdValid, comparePassword, convertPassword, errorResponse, successResponse } from 'src/util/helper';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs'
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { User_Test, UserTestDocument } from 'src/user-test/entities/user-test.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class UserService  {
  
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(User_Test.name) 
    private readonly userTestModel: Model<UserTestDocument>,

    @InjectModel(User.name) 
    private userModule: Model<User>, 
    @Inject(PRODUCT_SERVICE)
    private readonly productService:ClientProxy,
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache
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
  
  async findAllArrId({skip,take}:{
    skip: number,
    take:number
  }) {
    const user =  await this.userModule.find().where({roleId: "1010-002"}).select('_id').skip(skip).limit(take).sort({_id:1});
    const ids = user.map(u => u._id.toString());
    return successResponse(ids, 'Danh sách thông tin _id người dùng!');
  }
  
  async findAllArrName({skip,take}:{
    skip: number,
    take:number
  }) {
    const user =  await this.userModule.find().where({roleId: "1010-002"}).select('_id name').skip(skip).limit(take).sort({_id:1});
    return successResponse(user, 'Danh sách thông tin _id người dùng!');
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
    if(!comparePass) 
      return errorResponse(`Mật khẩu/ tài khoảng không đúng!`, HttpStatus.NOT_FOUND)
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
    return {data:{
      _id:data.id
    }
    };
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
        return {data:{
          _id
        }}
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

  //-----------------Product service-----------------------
  async getUser_ById_FromPost(_id:string){
    try {
    if (!Types.ObjectId.isValid(_id)) {
      throw new RpcException(`Mã người dùng sai: ${_id}`);
    }
    const user = await this.userModule.findById(_id).lean();
    if (!user) {
      throw new RpcException(`Người dùng không tồn tại!`);
    }
    return user;
    } catch (error) {
      throw new RpcException('Lỗi máy chủ!');
    }
  }


  async checkUserGoogle(signInGoogleDto: SignInGoogleDto){
    const {name,accountType,gender,isActive,email,avatar} = signInGoogleDto
    try {
      const checkUser = await this.userModule.findOne({email}).lean()
      if(checkUser){
        const {password, ...user} = checkUser
        return {
          data: {...user}
        }
      }
      const newUser =  await this.userModule.create({
        ...signInGoogleDto,
      })
      const user = newUser.toObject();
      const { password, ...rest } = user;
      return {
        data: { ...rest }
      };
    } catch (error) {
      console.log(error)
    }
  }
  
  //----------------Admin ----------------------------
  async getAllAuthor(lastId: string,){
    let matchStage: any = {
      roleId: "1010-002"
    };
    let sortStage: any = { _id: 1 };
    if (lastId.trim()) {
      // Trang trước
      matchStage = {
        ...matchStage,
        _id: { $gt: new mongoose.Types.ObjectId(lastId) },
      };
      sortStage = { _id: 1 };
    }
    // const data = await this.userModule.find().select("_id name")
    const dataQuery = await this.userModule.aggregate([
      { $match: matchStage },
      { $sort: sortStage },
      { $limit: 50 },
      {
        $project: {
          _id: 1,
          name: 1,
        }
      }
    ]); 
    let count = {} as any
    const cacheValue = await this.cacheManager.get(`author_count`)
    if(cacheValue){
      count= cacheValue
    }
    else{
      count = await this.userModule.countDocuments(matchStage)
      await this.cacheManager.set(`author_count`, count,600000);
    }
    //Đếm toàn bộ số bản ghi theo metadata
    // const countQuery = this.userModule.countDocuments(matchStage)
    // const [getAllAuthor_ByAdmin, countAllAuthor] = await Promise.all([
    //   dataQuery,countQuery
    // ])
    const dataResponse = {
        data: {
          getAllAuthor_ByAdmin: dataQuery,
          countAllAuthor_ByAdmin: count
        },
        errorField: null
      }
    return dataResponse
  }

  async getAllAdminList(){
    return await this.userModule.find({
      roleId: "1010-002"
    }).select("_id name roleId")
  }

  async createUser_ByAdmin(createUserDto: CreateUserDto){
    const {avatar, password, email, ...dataQuery} = createUserDto
    const checkUser = await this.isEmailExist(email)
    if(checkUser){
      return errorResponse(`Email: ${email} đã tồn tại!`, HttpStatus.NOT_FOUND)
    }
    const hashPassword = await convertPassword(password);
    const codeId = uuidv4();
    const data = await this.userModule.create({
      email,
      password:hashPassword,
      avatar: avatar?.trim() ? avatar : null,
      codeId,
      codeExpired:dayjs().add(5,'minutes'),
      ...dataQuery
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
    return {data:{
      _id:data.id
    }
    }
  }

  async updateUser_ByAdmin(updateUserDto: UpdateUserInfoDto){
    const {_id,avatar, email, ...dataQuery} = updateUserDto
    const checkUser = await this.isEmailExist(email,_id)
    if(checkUser){
      return errorResponse(`Email: ${email} đã tồn tại!`, HttpStatus.NOT_FOUND)
    }
    const data = await this.userModule.findByIdAndUpdate(
      _id,
      {
        email,
        avatar: avatar?.trim() ? avatar : null,
        ...dataQuery
      },
      { new: true }
    )
    return {
      data:{_id:data?.id}
    }
  }


  async deleteUser_ByAdmin(_id: string){
    const checkUser = await this.userModule.findById(_id)
    if(!checkUser){
      return errorResponse(`User: ${_id} không tồn tại!`, HttpStatus.NOT_FOUND)
    }
    const data = await this.userModule.findByIdAndDelete(_id)
    return {
      data: {
        success: data ? true : false
      }
    }
  }

  async getAllArrUser({
      skip,
      take,
      cursor
    }:{
      skip: number,
      take: number,
      cursor:{
        type:number,
        firstId?:string,
        lastId?:string
      }
    }){
      const { type, firstId, lastId } = cursor;
      const cacheValue = await this.cacheManager.get(`userSelect_${skip}_${take}`)
      if(cacheValue){
        return cacheValue
      }
      let matchStage: any = {};
      let sortStage: any = { _id: 1 };
      if (type === 0) {
        // Trang đầu tiên
        matchStage = {};
        sortStage = { _id: 1 };
      } else if (type === 1 && firstId) {
        // Trang trước
        matchStage = { _id: { $lt: new mongoose.Types.ObjectId(firstId) } };
        sortStage = { _id: -1 };
      } else if (type === 2 && lastId) {
        // Trang sau
        matchStage = { _id: { $gt: new mongoose.Types.ObjectId(lastId) } };
        sortStage = { _id: 1 };
      } else if (type === 3) {
        // Trang cuối
        matchStage = {};
        sortStage = { _id: -1 };
      }
      const dataQuery = this.userModule.aggregate([
        { $match: matchStage },
        { $sort: sortStage },
        { $limit: take },
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "slug",
            as: "roleInfo"
          }
        },
        { $unwind: "$roleInfo" },
        {
          $project: {
            _id: 1,
            name: 1,
            gender: 1,
            email: 1,
            avatar: 1,
            roleId: 1,
            accountType: 1,
            isActive: 1,
            createdAt: 1,
            updatedAt: 1,
            roleInfo: 1,
          }
        }
      ]);
      //Đếm toàn bộ số bản ghi theo metadata
      const countQuery = this.userModule.estimatedDocumentCount()
      const [getAllUserList_ByAdmin, countAllUserList_ByAdmin] = await Promise.all([
        dataQuery,countQuery
      ])
      //.explain("executionStats");
      // // step 1: lấy danh sách id theo sort + skip + limit
      // const ids = await this.userTestModel.find()
      //   .sort({ _id: -1 })
      //   .skip(skip)
      //   .limit(take)
      //   .select({ _id: 1 })
      //   .lean();
  
      // // step 2: query lại để lấy full document + join
      // const data = await this.userTestModel.aggregate([
      //   { $match: { _id: { $in: ids.map(i => i._id) } } },
      //   {
      //     $lookup: {
      //       from: "roles",
      //       localField: "roleId",
      //       foreignField: "slug",
      //       as: "roleInfo"
      //     }
      //   },
      //   { $project: { 
      //     _id: 1,
      //     name: 1,
      //     gender: 1,
      //     password: 1,
      //     avatar: 1,
      //     roleId: 1,
      //     accountType: 1,
      //     isActive: 1,
      //     createdAt: 1,
      //     updatedAt: 1,
      //     roleInfo: 1,
      //    } }
      // ]);
      const dataResponse = {
        data: {
          getAllUserList_ByAdmin,
          countAllUserList_ByAdmin
        },
        errorField: null
      }
      await this.cacheManager.set(`userSelect_${skip}_${take}`, dataResponse,60000);
  
      return dataResponse
    }
}

