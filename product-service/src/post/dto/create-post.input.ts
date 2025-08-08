import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
@InputType()
export class CreatePostDTO {
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