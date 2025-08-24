import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
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
export class UpdateUserInfoDto extends PartialType(CreateUserDto) {
  @IsString()
  _id:string

  @IsString()
  name: string;

  @IsBoolean()
  gender: boolean;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  roleId: string;

  @IsString()
  accountType: string;

  @IsBoolean()
  isActive: boolean
}
