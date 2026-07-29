import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateResidentRequest {


  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  storageKey?: string;

  @IsOptional()
  @IsString()
  contentType?: string;

  @IsOptional()
  size?: number;


}