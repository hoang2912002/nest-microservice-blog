import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateElasticSearchInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
