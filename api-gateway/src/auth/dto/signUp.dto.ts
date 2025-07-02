import { Optional } from "@nestjs/common";
import { IsBoolean, IsEmail, IsString } from "class-validator";

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