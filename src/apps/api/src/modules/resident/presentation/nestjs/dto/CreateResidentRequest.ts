import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResidentRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
