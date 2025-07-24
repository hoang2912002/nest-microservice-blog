import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => Comment)
  createComment(@Args('createCommentInput') createCommentInput: CreateCommentInput) {
    return this.commentService.create(createCommentInput);
  }

  @Query(() => [Comment], { name: 'comment' })
  findAll() {
    return this.commentService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.commentService.findOne(id);
  }

  @Mutation(() => Comment)
  updateComment(@Args('updateCommentInput') updateCommentInput: UpdateCommentInput) {
    return this.commentService.update(updateCommentInput.id, updateCommentInput);
  }

  @Mutation(() => Comment)
  removeComment(@Args('id', { type: () => Int }) id: number) {
    return this.commentService.remove(id);
  }

  @Query(() => [Comment],{name:"getAll_PostComment"})
  async getAll_PostComment(
    @Args("postId", {type:()=> Int}) postId: number,
    @Args("skip", {type:()=> Int}) skip: number,
    @Args("take", {type:()=> Int}) take: number,
  ){
    return await this.commentService.getAll_PostComment({postId,skip,take})
  }
  @Query(()=>Int,  { name: "countAll_PostComment" })
  async countAll_PostComment(
    @Args("postId",{type:()=>Int}) postId: number
  ){
    return await this.commentService.countAll_PostComment(postId)
  }

  @ResolveField(() => User)
  async user(@Parent() comment: Comment): Promise<User> {
    return this.userService.getUserById(comment.authorId);
  }
  
  @ResolveField(() => Comment)
  async replies(@Parent() comment: Comment) {
    return await this.commentService.findReplies(comment.id);
  }
  

  @Mutation(()=> Comment,{name:"save_PostComment"})
  async save_PostComment(@Args("createCommentInput") createCommentInput: CreateCommentInput){
    return await this.commentService.save_PostComment(createCommentInput)
  }
}
