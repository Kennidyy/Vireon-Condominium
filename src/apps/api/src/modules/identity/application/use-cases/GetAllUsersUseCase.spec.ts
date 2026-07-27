import { GetAllUsersUseCase } from './GetAllUsersUseCase';
import { InMemoryUserRepository } from '../../infrastructure/mocks/InMemoryUserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';

describe('GetAllUsersUseCase', () => {
  let repository: InMemoryUserRepository;
  let useCase: GetAllUsersUseCase;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new GetAllUsersUseCase(repository);
  });

  it('should return all users', async () => {
    const email1 = Email.create('user1@email.com');
    const email2 = Email.create('user2@email.com');
    const password = Password.create('StrongPass123!');

    await repository.save(User.create(email1, password));
    await repository.save(User.create(email2, password));

    const users = await useCase.execute();
    expect(users).toHaveLength(2);
  });

  it('should return empty array when no users exist', async () => {
    const users = await useCase.execute();
    expect(users).toEqual([]);
  });
});
