import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';

@ObjectType()
@Directive('@key(fields: "_id")')
export class User {
    @Field()
    id: string;
    
    @Field()
    _id: string;

    @Field()
    name:string

    @Field()
    email:string

    @Field(()=>Boolean,{defaultValue:true})
    gender: boolean

    @Field({nullable:true})
    avatar?: string

    @Field(() => [Post])
    posts: Post[]

    @Field(() => [Comment])
    comments: Comment[]

    @Field(()=>String)
    roleId: string

    @Field()
    createdAt: Date;
    
    @Field()
    updatedAt: Date
}
