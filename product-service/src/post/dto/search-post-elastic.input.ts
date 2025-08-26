import { InputType, Int, Field } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@InputType()
export class PostElasticResponse  {
    @Field(() => [Post])
    getAllPost_ForElastic: Post[];

    @Field(() => Int)
    totalCountPost_ForElastic: number;
}