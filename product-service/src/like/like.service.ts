import { Injectable } from '@nestjs/common';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly prismaService: PrismaService
  ){}
  create(createLikeInput: CreateLikeInput) {
    return 'This action adds a new like';
  }

  findAll() {
    return `This action returns all like`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeInput: UpdateLikeInput) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }

  async getAll_PostLike(postId: number){
    return await this.prismaService.like.count({
      where:{
        postId
      }
    })
  }

  async check_User_LikedPost(
    {
      postId,userId
    }:{
      postId:number
      userId:string
    }){
    const data = await this.prismaService.like.findFirst({
      where:{
        postId,
        userId
      }
    })
    return !!data
  }

  async unLike_Post(
  {
    postId,userId
  }:{
    postId:number
    userId:string
  }){
    const data = await this.prismaService.like.delete({
      where:{
        userId_postId:{
          userId,
          postId
        }
      }
    })
    return !!data
  }
  
  async like_Post(
  {
    postId,userId
  }:{
    postId:number
    userId:string
  }){
    const data = await this.prismaService.like.create({
        data:{
          userId,
          postId
        }
    })
    return !!data
  }
}
