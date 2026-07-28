import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateResidentRequest {


  @IsString()
  userId!: string;

  @IsString()
  name!: string;
  @IsString()
  profilePhoto!: string;


}