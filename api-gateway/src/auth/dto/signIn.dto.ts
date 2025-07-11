import { Optional } from "@nestjs/common";
import { Field } from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class SignInGoogleDto{
    @Field()
    @IsString()
    name:string;

    @Field()
    @IsString()
    accountType:string;

    @Field(()=>Boolean)
    @IsBoolean()
    gender:boolean
    
    @Field(()=>Boolean)
    @IsBoolean()
    isActive:boolean


    @Field()
    @IsOptional()
    password?:string

    @Field()
    @IsEmail()
    email: string
    
    @IsOptional()
    @Field({nullable:true})
    avatar?: string
} 