import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SupbaseService } from './supbase.service';
import { Supbase } from './entities/supbase.entity';
import { CreateSupbaseInput } from './dto/create-supbase.input';
import { UpdateSupbaseInput } from './dto/update-supbase.input';

@Resolver(() => Supbase)
export class SupbaseResolver {
  constructor(private readonly supbaseService: SupbaseService) {}

  @Mutation(() => Supbase)
  createSupbase(@Args('createSupbaseInput') createSupbaseInput: CreateSupbaseInput) {
    return this.supbaseService.create(createSupbaseInput);
  }

  @Query(() => [Supbase], { name: 'supbase' })
  findAll() {
    return this.supbaseService.findAll();
  }

  @Query(() => Supbase, { name: 'supbase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.supbaseService.findOne(id);
  }

  @Mutation(() => Supbase)
  updateSupbase(@Args('updateSupbaseInput') updateSupbaseInput: UpdateSupbaseInput) {
    return this.supbaseService.update(updateSupbaseInput.id, updateSupbaseInput);
  }

  @Mutation(() => Supbase)
  removeSupbase(@Args('id', { type: () => Int }) id: number) {
    return this.supbaseService.remove(id);
  }
}
