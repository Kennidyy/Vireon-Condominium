import { User } from '../../domain/entities/User';

export class UserMapper {
  static toDomain(data: { id: string; email: string; password: string }): User {
    return User.restore(data.id, data.email, data.password);
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      email: user.email.value,
      password: user.password.value,
    };
  }
}
