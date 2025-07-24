import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';
async function buildCommentTree(comments: any[], parentId: number | null = null): Promise<any[]> {
  const result = await Promise.all(
    comments
      .filter(c => (c.parentId ?? null) === parentId)
      .map(async c => ({
        ...c,
        replies: await buildCommentTree(comments, c.id),
      }))
  );
  return result;
}

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
        // parentId: null
      },
      // skip,
      // take,
      orderBy:{
        createdAt:"desc"
      },
      include:{
        post:true,
      },
    })
    const renderData  = await buildCommentTree(data)
    return renderData.slice(skip, skip + take);
  }

  async countAll_PostComment(postId:number){
    return await this.prismaService.comment.count({
      where:{
        postId,
        parentId: null
      }
    })
  }

  async save_PostComment(createCommentInput: CreateCommentInput){
    const {postId,content,authorId,parentId,userName} = createCommentInput
    const data  = {
      content,
      authorId,
      post:{
        connect:{
          id: postId
        }
      },
      userName
    } as any
    if (parentId) {
      data.parent = {
        connect: {
          id: parentId,
        },
      };
    }
    return await this.prismaService.comment.create({
      data
    })
  }


  async findReplies(parentId: number){
  return await this.prismaService.comment.findMany({
    where: { parentId },
    include: { post:true, },
  });
}
}
