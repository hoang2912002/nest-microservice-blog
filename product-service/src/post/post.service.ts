import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorResponse, successResponse } from 'src/util/helper';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService
  ){}
  create(createPostInput: CreatePostInput) {
    return 'This action adds a new post';
  }

  async findAll({skip,take}:{skip:number,take:number}) {
    try {
      return await this.prismaService.post.findMany({
        skip,
        take,
      })
    } catch (error) {
      throw new Error('Lỗi máy chủ!')
    }
  }

  async countAllPost(){
    try {
      return await this.prismaService.post.count()
    } catch (error) {
      throw new Error('Lỗi máy chủ!')
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
