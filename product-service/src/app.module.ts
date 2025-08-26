import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ClientProxyModule } from './clientModule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloFederationDriver } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { TagModule } from './tag/tag.module';
import { LikeModule } from './like/like.module';
import { RedisModule } from './redis/redis.module';
import { NotificationModule } from './notification/notification.module';
import { SupbaseModule } from './supbase/supbase.module';
import { ElasticSearchModule } from './elastic-search/elastic-search.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
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
      uploads: {
        maxFileSize: 50 * 1024 * 1024, // 50MB
        maxFiles: 10, // hoặc tuỳ bạn
      },
      context: ({ req }) => {
        const userHeader = req.headers['x-user'];
        const user = userHeader ? JSON.parse(userHeader as string) : null;
        return { user }; // gắn vào context để các resolver dùng
      },
    }),
    UserModule,
    PostModule,
    CommentModule,
    TagModule,
    LikeModule,
    RedisModule,
    NotificationModule,
    SupbaseModule,
    ElasticSearchModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
