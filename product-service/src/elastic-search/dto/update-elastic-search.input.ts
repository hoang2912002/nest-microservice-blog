import { CreateElasticSearchInput } from './create-elastic-search.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateElasticSearchInput extends PartialType(CreateElasticSearchInput) {
  @Field(() => Int)
  id: number;
}
