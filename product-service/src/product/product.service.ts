import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService){}
  create(createProductInput: CreateProductInput) {
    return 'This action adds a new product';
  }

  findAll({skip,take}:{skip:number,take:number}) {
    return [
      {
        id:1,
        name:'Ngô'
      }
    ];
  }

  findOne(id: number) {
    return {
      id,
      name:'Hoàng'
    };
  }

  update(id: number, updateProductInput: UpdateProductInput) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
