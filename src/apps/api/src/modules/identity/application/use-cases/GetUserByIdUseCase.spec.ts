import { GetUserByIdUseCase } from './GetUserByIdUseCase';
import { InMemoryUserRepository } from '../../infrastructure/mocks/InMemoryUserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';

describe('GetUserByIdUseCase', () => {
  let repository: InMemoryUserRepository;
  let useCase: GetUserByIdUseCase;
  let createdUser: User;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    useCase = new GetUserByIdUseCase(repository);

    const email = Email.create('existing@email.com');
    const password = Password.create('StrongPass123!');
    createdUser = User.create(email, password);
    await repository.save(createdUser);
  });

  it('should return user when found', async () => {
    const result = await useCase.execute(createdUser.id);

    expect(result).toEqual({
      id: createdUser.id,
      email: 'existing@email.com',
    });
  });

  it('should throw when user not found', async () => {
    await expect(
      useCase.execute('non-existent-id'),
    ).rejects.toThrow('User not found');
  });
});
