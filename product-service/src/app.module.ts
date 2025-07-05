import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ClientProxyModule } from './clientModule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloFederationDriver } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule, 
    ProductModule, 
    ClientProxyModule,
    GraphQLModule.forRoot({
      // autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      //Đầu tiên là đang xây dựng 1 microservice sd graphql
      //Khai báo driver là ApolloFederationDriver để nestjs nhận biết đây là federation
      //Tức là không phải chạy graphql 1 cách độc lập mà đang kết nối các subgraph với nhau
      driver: ApolloFederationDriver,
      //federation: 2 để cho nestjs biết sẽ tạo 1 schema graphql tương ứng với apollo federation v2
      //Hỗ trợ:
      //@key, @shareable, @requires, @provides...
      //@interfaceObject
      autoSchemaFile: {
        federation: 2,
      },
    }),
    UserModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
