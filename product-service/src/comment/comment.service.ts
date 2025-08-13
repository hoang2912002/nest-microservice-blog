import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDTO, CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentDTO, UpdateCommentInput } from './dto/update-comment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { SOCKET_SERVICE, USER_SERVICE } from 'src/constants';
import { lastValueFrom } from 'rxjs';
import { da } from '@faker-js/faker/.';
import { RedisService } from 'src/redis/redis.service';
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
    private readonly prismaService: PrismaService,
    @Inject(SOCKET_SERVICE) private readonly socketClient: ClientProxy,
    private readonly redisClient: RedisService,

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

  async save_PostComment(
    {
      createCommentInput,
      token
    }:{
      createCommentInput: CreateCommentInput,
      token: any
    }){
    const {postId,content,authorId,parentId,userName} = createCommentInput
    //Tạo notification
    const type = parentId ? "reply_comment" : "comment";
    let receiverId = "";
    let authorName = token ? token?.user?.name : authorId
    const senderId = authorId
    if(parentId){
      const parentComment = await this.prismaService.comment.findUnique({
        where: { id: parentId },
        select: { 
          authorId: true,
        },
      });
      if(parentComment && parentComment.authorId !== authorId){
        receiverId = parentComment.authorId
      }
    }
    else{
      const dataPost = await this.prismaService.post.findUnique({
        where:{
          id: postId
        },
        select:{
          authorId:true
        }
      })
      receiverId = dataPost ? dataPost.authorId : authorId
    }
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
    const createComment =  await this.prismaService.comment.create({
      data
    })
    const contentNotification = parentId ? `${authorName} replied to your comment` : `${authorName} commented to your post`
    
    if(parentId || senderId !== receiverId){
      await this.prismaService.notification.create({
        data: {
          type,
          content: contentNotification,
          senderId,
          receiverId,
          postId,
          isRead:false,
          commentId: createComment.id,
        },
      });
      await this.redisClient.publish(
        'comment_notification',
        JSON.stringify({ senderId, content })
      )
    }
    return createComment
  }


  async findReplies(parentId: number){
    return await this.prismaService.comment.findMany({
      where: { parentId },
      include: { post:true, },
    });
  }

  //------------Admin--------------------------
  async getAllComment_ByAdmin({skip,take}:{skip:number,take:number}){
    const data = await this.prismaService.comment.findMany({
      skip,
      take,
      include:{
        post:true,
      },
    })
    return data
    // return data.map(comment => ({
    //   ...comment,
    //   userName: comment.parentId ? comment.userName : null,
    //   typeComment: comment.parentId ? 'Replies comment' : 'Comment'
    // }));
  }
  
  async countAllComment(){
    return await this.prismaService.comment.count()
  }

  async createNewComment(createCommentDTO: CreateCommentDTO){
    const {postId,authorId,content,userName,parentId} = createCommentDTO
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
    return await this.prismaService.comment.create({data})
  }

  async updateCommentFormAdmin(updateCommentDTO: UpdateCommentDTO){
    const {id, ...dataComment} = updateCommentDTO
    return await this.prismaService.comment.update({
      where:{
        id
      },
      data:{
        ...dataComment
      }
    })
  }
}
