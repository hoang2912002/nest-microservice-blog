import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { da } from '@faker-js/faker/.';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService
  ){}
  create(createCommentInput: CreateCommentInput) {
    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }


  async getAll_PostComment({
    postId,skip,take
  }:{
    postId:number,
    skip:number,
    take:number
  }){
    const data = await this.prismaService.comment.findMany({
      where:{
        postId,
      },
      skip,
      take,
      orderBy:{
        createdAt:"desc"
      },
      include:{
        post:true,
      },
    })
    return data
  }

  async countAll_PostComment(postId:number){
    return await this.prismaService.comment.count({
      where:{
        postId
      }
    })
  }

  async save_PostComment(createCommentInput: CreateCommentInput){
    const {postId,content,authorId} = createCommentInput
    return await this.prismaService.comment.create({
      data:{
        content,
        authorId,
        post:{
          connect:{
            id: postId
          }
        }
      }
    })
  }
}
