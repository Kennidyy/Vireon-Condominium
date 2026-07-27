import { DeleteUserByIdUseCase } from './DeleteUserByIdUseCase';
import { InMemoryUserRepository } from '../../infrastructure/mocks/InMemoryUserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';

describe('DeleteUserByIdUseCase', () => {
  let repository: InMemoryUserRepository;
  let useCase: DeleteUserByIdUseCase;
  let createdUser: User;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    useCase = new DeleteUserByIdUseCase(repository);

    const email = Email.create('todelete@email.com');
    const password = Password.create('StrongPass123!');
    createdUser = User.create(email, password);
    await repository.save(createdUser);
  });

  it('should delete an existing user', async () => {
    await useCase.execute(createdUser.id);

    const deleted = await repository.getById(createdUser.id);
    expect(deleted).toBeNull();
    expect(repository.users).toHaveLength(0);
  });

  it('should throw when user not found', async () => {
    await expect(
      useCase.execute('non-existent-id'),
    ).rejects.toThrow('User not found');
  });
});
