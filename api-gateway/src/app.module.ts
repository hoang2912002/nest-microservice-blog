import { Module, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ClientProxyModule } from './clientModule';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig, ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { JwtService } from '@nestjs/jwt';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { RoleModule } from './role/role.module';
import  * as dayjs from 'dayjs';
import { ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ThrottleConfig } from 'rxjs';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ClientProxyModule,
    UserModule,
    AuthModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<ApolloGatewayDriverConfig> => ({
        // cors: true,
        // debug: true,
        // playground: true,
        server: {
          context: ({ req }) => {
            const token = req.headers.authorization?.split(' ')[1];
            const isPublic = req.body.isPublic
            if (isPublic) return { isPublic };
            if (!token) throw new UnauthorizedException('Missing token');
            try {
              const jwt = new JwtService({
                secret: configService.get<string>('JWT_SECRET_KEY'),
              });
              const user = jwt.verify(token);
              const isExpired = dayjs().unix() >= user.exp;
              if(isExpired){
                throw new UnauthorizedException('Token expired');
              }
              return { user, isPublic };
            } catch (err) {
              throw new UnauthorizedException('Invalid token');
            }
          },
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'product',
                url: configService.get<string>('PRODUCT_URL_GRAPHQL'),
              },
            ],
          }),
          buildService: ({ name, url }) => {
            //mục đích ở đây là để customize http response cho subgraph
            return new RemoteGraphQLDataSource({
              //RemoteGraphQLDataSource có thể override các lifecycle hook
              //willSendRequest là hook trc khi gửi request
              //didReceiveResponse là hook sau khi nhận response
              //didEncounterError	Hook khi có lỗi từ subgraph
              url,
              willSendRequest({ request, context }) {
                if (!context?.isPublic && context?.user) {
                  const userString = JSON.stringify(context.user);
                  request.http?.headers.set('x-user', userString);
                }
              },
              didEncounterError(error, fetchRequest, fetchResponse, context) {
                throw error;
              }
            });
          }
        },
      }),
      inject: [ConfigService],
    }),
    RoleModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<ThrottlerModuleOptions> => ({
        throttlers: [
          {
            ttl: parseInt(configService.get<string>('THROTTLE_TTL') ?? '1000', 10),
            limit: parseInt(configService.get<string>('THROTTLE_LIMIT') ?? '100', 10),
          },
        ],
        storage: new ThrottlerStorageRedisService({
          host: configService.get<string>('REDIS_HOST') ?? '127.0.0.1',
          port: parseInt(configService.get<string>('REDIS_PORT') ?? '6379', 10),
        }),
      }),
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})

export class AppModule {}
