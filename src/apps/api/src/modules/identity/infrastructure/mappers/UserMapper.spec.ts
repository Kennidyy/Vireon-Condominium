import { UserMapper } from './UserMapper';
import { User } from '../../domain/entities/User';
import { UserRole as DomainRole } from '../../domain/enum/UserRole';

describe('UserMapper', () => {
  const prismaUser = {
    id: 'map-id-123',
    email: 'mapped@email.com',
    password: '$argon2hash',
    role: 'ADMIN' as const,
  };

  describe('toDomain', () => {
    it('should map Prisma data to domain User', () => {
      const user = UserMapper.toDomain(prismaUser);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe('map-id-123');
      expect(user.email.value).toBe('mapped@email.com');
      expect(user.password.value).toBe('$argon2hash');
      expect(user.role).toBe(DomainRole.ADMIN);
    });

    it('should map USER role correctly', () => {
      const user = UserMapper.toDomain({ ...prismaUser, role: 'USER' });
      expect(user.role).toBe(DomainRole.USER);
    });

    it('should map ADMIN role correctly', () => {
      const user = UserMapper.toDomain({ ...prismaUser, role: 'ADMIN' });
      expect(user.role).toBe(DomainRole.ADMIN);
    });
  });

  describe('toPersistence', () => {
    it('should map domain User to persistence format', () => {
      const user = User.restore(
        'persist-id',
        'persist@email.com',
        '$hash',
        DomainRole.ADMIN,
      );

      const data = UserMapper.toPersistence(user);

      expect(data).toEqual({
        id: 'persist-id',
        email: 'persist@email.com',
        password: '$hash',
        role: 'ADMIN',
      });
    });

    it('should map USER role correctly', () => {
      const user = User.restore('id', 'e@e.com', 'hash', DomainRole.USER);
      const data = UserMapper.toPersistence(user);
      expect(data.role).toBe('USER');
    });

    it('should map ADMIN role correctly', () => {
      const user = User.restore('id', 'e@e.com', 'hash', DomainRole.ADMIN);
      const data = UserMapper.toPersistence(user);
      expect(data.role).toBe('ADMIN');
    });
  });

  describe('round-trip', () => {
    it('should preserve data through toDomain and toPersistence', () => {
      const domain = UserMapper.toDomain(prismaUser);
      const backToPersistence = UserMapper.toPersistence(domain);

      expect(backToPersistence).toEqual(prismaUser);
    });
  });
});
