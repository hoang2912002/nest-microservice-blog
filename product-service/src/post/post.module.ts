import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { ClientProxyModule } from 'src/clientModule';
import { SupbaseService } from 'src/supbase/supbase.service';
import { ElasticSearchModule } from 'src/elastic-search/elastic-search.module';

@Module({
  imports:[ClientProxyModule,ElasticSearchModule],
  providers: [PostResolver, PostService,PrismaService,UserService,SupbaseService],
})
export class PostModule {}
