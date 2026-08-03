import { IsEmail, IsString } from 'class-validator';

export class AuthUserRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
