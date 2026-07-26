import { CreateUserUseCase } from './CreateUserUseCase';
import { InMemoryUserRepository } from '../../infrastructure/mocks/InMemoryUserRepository';
import { FakePasswordHasher } from '../../infrastructure/mocks/FakePasswordHasher';

describe('CreateUserUseCase', () => {
  let repository: InMemoryUserRepository;
  let hasher: FakePasswordHasher;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    hasher = new FakePasswordHasher();
    useCase = new CreateUserUseCase(hasher, repository);
  });

  it('should create a user', async () => {
    await useCase.execute({
      email: 'meuemail@gmail.com',
      password: 'SenhAP1sfa32#$3!',
    });

    const user = await repository.getByEmail('meuemail@gmail.com');
    expect(user).not.toBeNull();
    expect(user!.email.value).toBe('meuemail@gmail.com');
    expect(repository.users).toHaveLength(1);
  });

  it('should not create user with duplicated email', async () => {
    await useCase.execute({
      email: 'hohoho@hotmail.com',
      password: 'password@122#FAF',
    });

    await expect(
      useCase.execute({
        email: 'hohoho@hotmail.com',
        password: 'OutraSenha@123',
      }),
    ).rejects.toThrow('This email is already in use');
  });

  it('should save hashed password', async () => {
    await useCase.execute({
      email: 'hohoho@hotmail.com',
      password: '123Nikas!@3#$',
    });

    const user = await repository.getByEmail('hohoho@hotmail.com');
    expect(user!.password.value).toBe('$hashed_123Nikas!@3#$');
  });

  it('should throw on invalid email', async () => {
    await expect(
      useCase.execute({
        email: 'invalido',
        password: 'SenhAP1sfa32#$3!',
      }),
    ).rejects.toThrow('Invalid email');
  });

  it('should throw on weak password', async () => {
    await expect(
      useCase.execute({
        email: 'valido@email.com',
        password: 'fraca',
      }),
    ).rejects.toThrow('Password must have at least 10 characters');
  });
});
