import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { SignUpDto, VerifyTokenDto } from './dto/signUp.dto';
import { GoogleOauthGuard } from './passport/google-oauth.guard';
import { Response } from 'express';
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

    @Public()
    @Get("google/login")
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Req() req) {
        // Guard redirects
    }
    @Public()
    @Get("google/callback")
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const user = await this.authService.login(req?.user, res)

        res.redirect(`http://localhost:3000/api/auth/google/callback?userId=${user.data?.user._id}
            &name=${user.data?.user.name}&avatar=${user.data?.user.avatar}&accessToken=${user.data?.access_token}`)
        return  req;
    }
}
