import { File } from 'buffer';
import { CreatePostInput } from './create-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field(() => Int)
  id: number;
}


export class UploadChunkDto {
  @Field(()=>String,{nullable:true})
  filename: string;

  @Field(()=>String,{nullable:true})
  index: string;

  @Field(()=>String,{nullable:true})
  total: string;

  @Field(()=>String,{nullable:true})
  postId: string;
}

@InputType()
export class UpdatePostDTO {
  @Field(() => Int)
  id: number

  @Field()
  title: string
  
  @Field()
  content: string
  
  @Field()
  thumbnail: string
  
  @Field(() => Boolean,{defaultValue: false})
  published: boolean

  @Field()
  authorId: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => String, {nullable:true})
  slug?: string
}