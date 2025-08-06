import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSupbaseInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
