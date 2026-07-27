import { UpdateUserUseCase } from './UpdateUserUseCase';
import { InMemoryUserRepository } from '../../infrastructure/mocks/InMemoryUserRepository';
import { FakePasswordHasher } from '../../infrastructure/mocks/FakePasswordHasher';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { UserRole } from '../../domain/enum/UserRole';

describe('UpdateUserUseCase', () => {
  let repository: InMemoryUserRepository;
  let hasher: FakePasswordHasher;
  let useCase: UpdateUserUseCase;
  let createdUser: User;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    hasher = new FakePasswordHasher();
    useCase = new UpdateUserUseCase(repository, hasher);

    const email = Email.create('original@email.com');
    const password = Password.create('StrongPass123!');
    createdUser = User.create(email, password);
    await repository.save(createdUser);
  });

  it('should update email', async () => {
    await useCase.execute(createdUser.id, { email: 'updated@email.com' });

    const updated = await repository.getById(createdUser.id);
    expect(updated!.email.value).toBe('updated@email.com');
  });

  it('should update password', async () => {
    await useCase.execute(createdUser.id, { password: 'NewStrongPass123!' });

    const updated = await repository.getById(createdUser.id);
    expect(updated!.password.value).toBe('$hashed_NewStrongPass123!');
  });

  it('should update role', async () => {
    await useCase.execute(createdUser.id, { role: UserRole.ADMIN });

    const updated = await repository.getById(createdUser.id);
    expect(updated!.role).toBe(UserRole.ADMIN);
  });

  it('should update multiple fields at once', async () => {
    await useCase.execute(createdUser.id, {
      email: 'new@email.com',
      role: UserRole.ADMIN,
    });

    const updated = await repository.getById(createdUser.id);
    expect(updated!.email.value).toBe('new@email.com');
    expect(updated!.role).toBe(UserRole.ADMIN);
  });

  it('should throw when user not found', async () => {
    await expect(
      useCase.execute('non-existent-id', { email: 'any@email.com' }),
    ).rejects.toThrow('User not Found');
  });

  it('should throw on invalid email format', async () => {
    await expect(
      useCase.execute(createdUser.id, { email: 'invalid' }),
    ).rejects.toThrow('Invalid Email Format');
  });
});
