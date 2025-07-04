import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxyModule } from 'src/clientModule';
import { ProductController } from './product.controller';

@Module({
  imports:[ClientProxyModule],
  providers: [
    ProductResolver, 
    ProductService,
    PrismaService
  ],
  controllers:[ProductController]
})
export class ProductModule {}
