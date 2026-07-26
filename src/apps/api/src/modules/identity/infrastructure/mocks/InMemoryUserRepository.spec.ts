import { InMemoryUserRepository } from './InMemoryUserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { UserRole } from '../../domain/enum/UserRole';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;
  let user: User;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    const email = Email.create('test@email.com');
    const password = Password.create('StrongPass123!');
    user = User.create(email, password);
  });

  describe('save', () => {
    it('should save a user', async () => {
      await repository.save(user);
      expect(repository.users).toHaveLength(1);
      expect(repository.users[0].id).toBe(user.id);
    });
  });

  describe('getByEmail', () => {
    it('should find user by email', async () => {
      await repository.save(user);
      const found = await repository.getByEmail('test@email.com');
      expect(found).not.toBeNull();
      expect(found!.id).toBe(user.id);
    });

    it('should return null when email not found', async () => {
      const found = await repository.getByEmail('nonexistent@email.com');
      expect(found).toBeNull();
    });
  });

  describe('getById', () => {
    it('should find user by id', async () => {
      await repository.save(user);
      const found = await repository.getById(user.id);
      expect(found).not.toBeNull();
      expect(found!.email.value).toBe('test@email.com');
    });

    it('should return null when id not found', async () => {
      const found = await repository.getById('nonexistent-id');
      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      await repository.save(user);
      const newEmail = Email.create('updated@email.com');
      user.changeEmail(newEmail);
      await repository.update(user);

      const updated = await repository.getById(user.id);
      expect(updated!.email.value).toBe('updated@email.com');
    });

    it('should not throw when updating non-existent user', async () => {
      await expect(repository.update(user)).resolves.toBeUndefined();
    });
  });

  describe('deleteById', () => {
    it('should delete an existing user', async () => {
      await repository.save(user);
      await repository.deleteById(user.id);
      expect(repository.users).toHaveLength(0);
    });

    it('should not throw when deleting non-existent user', async () => {
      await expect(repository.deleteById('nonexistent-id')).resolves.toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      await repository.save(user);

      const email2 = Email.create('user2@email.com');
      const password2 = Password.create('StrongPass456!');
      const user2 = User.create(email2, password2);
      await repository.save(user2);

      const all = await repository.getAll();
      expect(all).toHaveLength(2);
    });

    it('should return empty array when no users', async () => {
      const all = await repository.getAll();
      expect(all).toEqual([]);
    });
  });
});
