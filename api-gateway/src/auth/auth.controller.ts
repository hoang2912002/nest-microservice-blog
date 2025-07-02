import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}
    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ResponseMessage("Fetch login")
    async login(@Request() req){
        return await this.authService.login(req.user)
    }

    @Public()
    @Post("signUp")
    async signUp(@Body() signUpDto:SignUpDto){
        return await this.authService.signUp(signUpDto)
    }
}
