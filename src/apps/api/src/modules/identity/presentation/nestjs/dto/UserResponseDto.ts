import { User } from '../../../domain/entities/User';

export class UserResponseDto {
  id: string;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email.value;
  }
}
