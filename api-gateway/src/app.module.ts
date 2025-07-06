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
import { IntrospectAndCompose } from '@apollo/gateway';
import  * as dayjs from 'dayjs';

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
            if(isPublic) return true
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
              return { user };
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
          })
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
