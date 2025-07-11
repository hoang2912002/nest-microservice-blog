import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { ClientProxyModule } from 'src/clientModule';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { GoogleOauthStrategy } from './passport/google-oauth.strategy';

@Module({
  imports:[
    UserModule,
    ClientProxyModule,
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory:async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
         
      }),
    }),
  ],
  providers: [AuthService,UserService,LocalStrategy,JwtStrategy,GoogleOauthStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
