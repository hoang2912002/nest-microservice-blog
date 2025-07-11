import { Optional } from "@nestjs/common"
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator"

export class CreateUserDto {}


export class SignUpDto {
    @IsString()
    name:string

    @IsBoolean()
    gender:boolean

    @IsString()
    @IsEmail()
    email:string


    @IsString()
    password:string

    @IsString()
    @Optional()
    avatar:string
}

export class VerifyTokenDto {
    @IsString()
    _id: string

    @IsString()
    codeId:string
}

export class SignInGoogleDto {
    @IsString()
    name:string;

    @IsString()
    accountType:string;

    @IsBoolean()
    gender:boolean
    
    @IsBoolean()
    isActive:boolean


    @IsOptional()
    password?:string

    @IsEmail()
    email: string
    
    @IsOptional()
    avatar?: string
}