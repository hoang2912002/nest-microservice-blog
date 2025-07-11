import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback,  Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET_CODE'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done:VerifyCallback
  ) {
    const { emails, displayName, photos  } = profile;
    const user = await this.authService.validateGoogleAccount({
        email: emails[0].value,
        name: displayName,
        accountType: 'Google',
        avatar: photos[0].value,
        password:"",
        gender:true,
        isActive:true,
    })
    done(null,user)
    // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    
  }
}