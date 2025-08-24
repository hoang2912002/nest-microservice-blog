import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateUserTestDto {
    @IsString()
    name: string;

    @IsBoolean()
    gender: boolean;

    @IsString()
    email: string;

    @IsString()
    password: string;

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
