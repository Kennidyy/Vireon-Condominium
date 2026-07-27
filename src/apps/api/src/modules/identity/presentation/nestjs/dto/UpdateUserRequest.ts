import { UserRole } from "../../../domain/enum/UserRole"
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator"

export class UpdateUserRequest {

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    @MinLength(10)
    password?: string

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole

}