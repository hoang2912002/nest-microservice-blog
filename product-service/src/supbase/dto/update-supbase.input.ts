import { CreateSupbaseInput } from './create-supbase.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSupbaseInput extends PartialType(CreateSupbaseInput) {
  @Field(() => Int)
  id: number;
}
