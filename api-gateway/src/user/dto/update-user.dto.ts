import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    name:string
    
    @IsBoolean()
    gender:boolean

    @IsString()
    @IsEmail()
    email:string


    @IsString()
    @Optional()
    password:string

    @IsString()
    @Optional()
    avatar:string

    @IsString()
    roleId:string
}
