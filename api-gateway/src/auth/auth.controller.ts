import { Body, Controller, HttpCode, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { SignUpDto, VerifyTokenDto } from './dto/signUp.dto';

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
    async login(@Request() req, @Res({ passthrough: true }) res: Response){
        return await this.authService.login(req.user, res)
    }

    @Public()
    @Post("signUp")
    async signUp(@Body() signUpDto:SignUpDto){
        return await this.authService.signUp(signUpDto)
    }
    
    @Post("getSession")
    async getSession(@Req() req: Request){
        return await this.authService.getSession(req)
    }

    @Public()
    @Post("verify_token")
    async verifyToken(@Body() verifyTokenDto:VerifyTokenDto){
        return await this.authService.verifyToken(verifyTokenDto)
    }

    @Public()
    @Post("resend_verify_token")
    async resendVerifyToken(@Body("_id") _id:string){
        return await this.authService.resendVerifyToken(_id)
    }
}
