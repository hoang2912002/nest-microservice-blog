import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePrismaInput } from './dto/create-prisma.input';
import { UpdatePrismaInput } from './dto/update-prisma.input';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  create(createPrismaInput: CreatePrismaInput) {
    return 'This action adds a new prisma';
  }

  findAll() {
    return `This action returns all prisma`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prisma`;
  }

  update(id: number, updatePrismaInput: UpdatePrismaInput) {
    return `This action updates a #${id} prisma`;
  }

  remove(id: number) {
    return `This action removes a #${id} prisma`;
  }
}
