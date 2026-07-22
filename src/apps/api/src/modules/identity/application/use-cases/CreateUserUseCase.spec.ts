import { CreateUserUseCase } from './CreateUserUseCase';
import { InMemoryUserRepository } from '../../infrastructure/mocks/InMemoryUserRepository';
import { FakePasswordHasher } from '../../infrastructure/mocks/FakePasswordHasher';

describe('Create User Use Case', () => {
  let repository: InMemoryUserRepository;
  let hasher: FakePasswordHasher;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    hasher = new FakePasswordHasher();

    useCase = new CreateUserUseCase(hasher, repository);
  });

  it('should create a user', async () => {
    const user = await useCase.execute({
      email: 'meuemail@gmail.com',
      password: 'SenhAP1sfa32#$3!',
    });

    expect(user.email.value).toBe('meuemail@gmail.com');

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
    const user = await useCase.execute({
      email: 'hohoho@hotmail.com',
      password: '123Nikas!@3#$',
    });

    expect(user.password.value).toBe('$hashed_123Nikas!@3#$');
  });
});
