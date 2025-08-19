import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { CreateLikeDTO, CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeDTO, UpdateLikeInput } from './dto/update-like.input';
import { skip } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Post } from 'src/post/entities/post.entity';

@Resolver(() => Like)
export class LikeResolver {
  constructor(
    private readonly likeService: LikeService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Like)
  createLike(@Args('createLikeInput') createLikeInput: CreateLikeInput) {
    return this.likeService.create(createLikeInput);
  }

  @Query(() => [Like], { name: 'like' })
  findAll() {
    return this.likeService.findAll();
  }

  @Query(() => Like, { name: 'like' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.likeService.findOne(id);
  }

  @Mutation(() => Like)
  updateLike(@Args('updateLikeInput') updateLikeInput: UpdateLikeInput) {
    return this.likeService.update(updateLikeInput.id, updateLikeInput);
  }

  @Mutation(() => Like)
  removeLike(@Args('id', { type: () => Int }) id: number) {
    return this.likeService.remove(id);
  }


  @Query(() => Int,{name:"getAll_PostLike"})
  getAll_PostLike(
    @Args("postId",{type:()=>Int}) postId: number
  ){
    return this.likeService.getAll_PostLike(postId)
  }

  @Query(()=> Boolean, {name:"check_User_LikedPost"})
  check_User_LikedPost(
    @Args("postId",{type:()=>Int}) postId: number,
    @Args("userId",{type:()=>String}) userId: string
  ){
    return this.likeService.check_User_LikedPost({postId,userId})
  }

  @Mutation(() => Boolean, {name: "unLike_Post"})
  unLike_Post(
    @Args("postId",{type:()=>Int}) postId: number,
    @Args("userId",{type:()=>String}) userId: string
  ){
    return this.likeService.unLike_Post({postId,userId})
  }
  
  @Mutation(() => Boolean, {name: "like_Post"})
  like_Post(
    @Args("postId",{type:()=>Int}) postId: number,
    @Args("userId",{type:()=>String}) userId: string
  ){
    return this.likeService.like_Post({postId,userId})
  }

  //----------------Admin------------------------------
  @Query(() => [Like], {name: "getAllLike_ByAdmin"})
  getAllLike_ByAdmin(
    @Args("skip", {type:() => Int}) skip: number,
    @Args("take", {type:() => Int}) take: number,
  ){
    return this.likeService.getAllLike_ByAdmin({skip,take})
  }

  @ResolveField(() => User)
  async user(@Parent() like: Like): Promise<User> {
    return this.userService.getUserById(like.userId);
  }

  @Query(() => Int, {name: "countAllLike"})
  countAllLike(){
    return this.likeService.countAllLike()
  }

  @Mutation(() => Like, {name:"updateLike_ByAdmin"})
  updateLike_ByAdmin(
    @Args('updateLikeDTO') updateLikeDTO: UpdateLikeDTO
  ){
    return this.likeService.updateLike_ByAdmin(updateLikeDTO)
  }

  @Mutation(() => Like, {name : "createLike_ByAdmin"})
  createLike_ByAdmin(
    @Args("createLikeDTO") createLikeDTO: CreateLikeDTO
  ){
    return this.likeService.createLike_ByAdmin(createLikeDTO)
  }
}
