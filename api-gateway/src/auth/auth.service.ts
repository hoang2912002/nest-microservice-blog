import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from 'src/constants';
import { SignInDto } from 'src/user/dto/signin.dto';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signUp.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        @Inject(USER_SERVICE)
        private userServiceClient: ClientProxy,
        private jwtService:JwtService
    ) {}
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.login({username,password});
        if (user) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }

    async login(user:any){
        const payload = { username: user.name, sub: user._id };
        const access_token= await this.jwtService.signAsync(payload);
        return {
            access_token,
            user:{
                email: user?.email,
                _id: user?._id,
                name: user?.name,
                avatar:user?.avatar
            }
        };
    }

    async signUp(signUpDto:SignUpDto){
        return await firstValueFrom(this.userServiceClient.send("signUp",signUpDto))
    }
}
