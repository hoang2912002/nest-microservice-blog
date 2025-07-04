import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PrismaService } from './prisma.service';
import { Prisma } from './entities/prisma.entity';
import { CreatePrismaInput } from './dto/create-prisma.input';
import { UpdatePrismaInput } from './dto/update-prisma.input';

@Resolver(() => Prisma)
export class PrismaResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Mutation(() => Prisma)
  createPrisma(@Args('createPrismaInput') createPrismaInput: CreatePrismaInput) {
    return this.prismaService.create(createPrismaInput);
  }

  @Query(() => [Prisma], { name: 'prisma' })
  findAll() {
    return this.prismaService.findAll();
  }

  @Query(() => Prisma, { name: 'prisma' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.prismaService.findOne(id);
  }

  @Mutation(() => Prisma)
  updatePrisma(@Args('updatePrismaInput') updatePrismaInput: UpdatePrismaInput) {
    return this.prismaService.update(updatePrismaInput.id, updatePrismaInput);
  }

  @Mutation(() => Prisma)
  removePrisma(@Args('id', { type: () => Int }) id: number) {
    return this.prismaService.remove(id);
  }
}
