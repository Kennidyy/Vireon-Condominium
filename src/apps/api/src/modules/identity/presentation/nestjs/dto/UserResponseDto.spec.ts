import { UserResponseDto } from './UserResponseDto';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';

describe('UserResponseDto', () => {
  it('should create DTO from User entity exposing id and email', () => {
    const email = Email.create('dto@test.com');
    const password = Password.create('StrongPass123!');
    const user = User.create(email, password);

    const dto = new UserResponseDto(user);

    expect(dto.id).toBe(user.id);
    expect(dto.email).toBe('dto@test.com');
  });

  it('should not expose password', () => {
    const email = Email.create('safe@test.com');
    const password = Password.create('StrongPass123!');
    const user = User.create(email, password);

    const dto = new UserResponseDto(user);

    expect('password' in dto).toBe(false);
  });
});
