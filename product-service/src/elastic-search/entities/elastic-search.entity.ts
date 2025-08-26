import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ElasticSearch {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
