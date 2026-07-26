import { LoginUseCase } from './LoginUseCase';
import { InMemoryUserRepository } from '../../infrastructure/mocks/InMemoryUserRepository';
import { FakePasswordHasher } from '../../infrastructure/mocks/FakePasswordHasher';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import type { TokenSigner } from '../ports/TokenSigner';

describe('LoginUseCase', () => {
  let repository: InMemoryUserRepository;
  let hasher: FakePasswordHasher;
  let tokenSigner: TokenSigner;
  let useCase: LoginUseCase;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    hasher = new FakePasswordHasher();

    tokenSigner = {
      sign: jest.fn().mockResolvedValue('mocked-jwt-token'),
    };

    useCase = new LoginUseCase(repository, hasher, tokenSigner);

    const email = Email.create('existing@email.com');
    const password = Password.create('StrongPass123!');
    const hashed = await hasher.hash(password.value);
    const user = User.create(email, Password.fromHash(hashed));
    await repository.save(user);
  });

  it('should return an access token on valid credentials', async () => {
    const result = await useCase.execute({
      email: 'existing@email.com',
      password: 'StrongPass123!',
    });

    expect(result.accessToken).toBe('mocked-jwt-token');
  });

  it('should throw on wrong email', async () => {
    await expect(
      useCase.execute({
        email: 'wrong@email.com',
        password: 'StrongPass123!',
      }),
    ).rejects.toThrow('email or password are wrong');
  });

  it('should throw on wrong password', async () => {
    await expect(
      useCase.execute({
        email: 'existing@email.com',
        password: 'WrongPassword123!',
      }),
    ).rejects.toThrow('email or password are wrong');
  });

  it('should throw on invalid email format', async () => {
    await expect(
      useCase.execute({
        email: 'invalid',
        password: 'StrongPass123!',
      }),
    ).rejects.toThrow('Invalid email');
  });
});
