import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    username: string

    @IsString()
    password:string
}
