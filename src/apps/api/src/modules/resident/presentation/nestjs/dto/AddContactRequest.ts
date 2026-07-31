import { IsString } from 'class-validator';

export class AddContactRequest {
  @IsString()
  type!: string;

  @IsString()
  value!: string;
}
