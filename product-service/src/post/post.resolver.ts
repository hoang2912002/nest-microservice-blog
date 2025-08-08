import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { CreatePostDTO, CreatePostInput } from './dto/create-post.input';
import { UpdatePostDTO, UpdatePostInput, UploadChunkDto } from './dto/update-post.input';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService
  ) {}

  

  @Query(() => [Post], { name: 'post' })
  async findAll(
    @Args('skip',{type:()=>Int}) skip: number,
    @Args('take',{type:()=>Int}) take: number,
  ) {
    return await this.postService.findAll({skip,take});
  }

  @Query(() => Int, { name: "countAllPost" })
  async countAllPost(){
    return await this.postService.countAllPost()
  }
  

  @ResolveField(() => User)
  async user(@Parent() post: Post): Promise<User> {
    return this.userService.getUserById(post.authorId);
  }

  

  @Query(() => Post, { name: 'postById' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  // @Mutation(() => Post)
  // updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
  //   return this.postService.update(updatePostInput.id, updatePostInput);
  // }


  //Admin
  @Query(() => [Post], {name: 'getAllPost_ByAdmin'})
  async findAllByAdmin(
    @Args("skip", {type:()=> Int}) skip: number,
    @Args('take',{type:()=>Int}) take: number,
  ){
    return await this.postService.findAllByAdmin({skip,take});
  }

  @Mutation(() => Boolean, {name: 'uploadFileChunkPost'})
  async uploadFileChunkPost(
    @Args('file',{type:()=>String}) file: string,
    @Args('folderName',{type:()=>String}) folderName: string,
    @Args('fileName',{type:()=>String}) fileName: string
  ){
    return await this.postService.uploadFileChunkPost(file,folderName,fileName)
  }

  
  @Query(() => String, {name: 'getMergeFile'})
  async getMergeFile(
    @Args("folderName",{type:()=> String}) folderName: string
  ){
    return await this.postService.mergeFiles(folderName)
  }

  @Mutation(() => Post, {name: 'update'})
  async update(
    @Args('updatePostDTO') updatePostDTO: UpdatePostDTO
  ){
    return this.postService.update(updatePostDTO)
  }

  @Mutation(() => Boolean, {name: "delete"})
  async delete(
    @Args("id", {type: () => Int}) id: number
  ){
    return await this.postService.remove(id)
  }

  @Mutation(() => Post, {name: 'create'})
  create(@Args('createPostDTO') createPostDTO: CreatePostDTO) {
    return this.postService.create(createPostDTO);
  }

  @Query(() => [Post],{name:"getAllPost_ForComment"})
  getAllPost_ForComment(){
    return this.postService.getAllPost_ForComment()
  }
}
