import { Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from 'src/constants';
import { UserService } from 'src/user/user.service';
import { SignUpDto, VerifyTokenDto } from './dto/signUp.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Response } from 'express';
import { SignInGoogleDto } from './dto/signIn.dto';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        private usersService: UserService,
        @Inject(USER_SERVICE)
        private userServiceClient: ClientProxy,
        private jwtService:JwtService
    ) {}

    async onModuleInit(): Promise<void> {
        try {
            //Đây là lifecycle của hook 
            //tức là khi mà module service được khỏi tạo ngay sau đó nó sẽ gọi đến hàm này 
            //tức là đối với microserive cần phải dùng nó đối với các giao thức của gRPC, Kafka để subcribe service
            await this.userServiceClient.connect();
            const response = await this.userServiceClient.send('ping', {}).toPromise();
            console.log('Ping result:', response);
        } catch (error) {
            console.error('Error pinging user service:', error.message || error);
        }
    }
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.login({username,password});
        if (user && user.statusCode === 200) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }

    async login(user:any,res:any){
        const {email,_id,name,avatar,isActive } = user.data
        if(!isActive){
            return {
                errorField:"isActive",
                message:"Tài khoản chưa được kích hoạt"
            }
        }
        const payload = { username: name, sub: _id };
        const access_token= await this.jwtService.signAsync(payload);
        const data = {
            access_token,
            user:{
                email,
                _id,
                name,
                avatar
            }
        };
        return {
            data
        }
    }

    async signUp(signUpDto:SignUpDto){
        return await firstValueFrom(this.userServiceClient.send("signUp",signUpDto))
    }

    async verifyToken(verifyTokenDto:VerifyTokenDto){
        return await firstValueFrom(this.userServiceClient.send("verifyToken",verifyTokenDto))
    }

    async resendVerifyToken(_id:string){
        return await firstValueFrom(this.userServiceClient.send("resendVerifyToken",_id))
    }
    

    async getSession(req:any){
        const cookie = req.cookies['session']
        if(!cookie){
            throw new UnauthorizedException("Không tìm thấy phiên đăng nhập!")
        }
        return cookie
    }


    async validateGoogleAccount(signInGoogleDto:SignInGoogleDto){
        return await lastValueFrom(this.userServiceClient.send("checkUserGoogle",signInGoogleDto))
    }
}
