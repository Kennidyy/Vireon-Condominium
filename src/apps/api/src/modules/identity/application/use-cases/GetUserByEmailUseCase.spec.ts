import { GetUserByEmailUseCase } from './GetUserByEmailUseCase';
import { InMemoryUserRepository } from '../../infrastructure/mocks/InMemoryUserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';

describe('GetUserByEmailUseCase', () => {
  let repository: InMemoryUserRepository;
  let useCase: GetUserByEmailUseCase;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    useCase = new GetUserByEmailUseCase(repository);

    const email = Email.create('existing@email.com');
    const password = Password.create('StrongPass123!');
    await repository.save(User.create(email, password));
  });

  it('should return user when found', async () => {
    const result = await useCase.execute('existing@email.com');

    expect(result).toEqual({
      id: expect.any(String) as string,
      email: 'existing@email.com',
    });
  });

  it('should throw when user not found', async () => {
    await expect(useCase.execute('notfound@email.com')).rejects.toThrow(
      'User not found',
    );
  });
});
