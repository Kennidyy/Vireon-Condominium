import { User } from './User';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';
import { UserRole } from '../enum/UserRole';

describe('User Entity', () => {
  const validEmail = Email.create('user@email.com');
  const validPassword = Password.create('StrongPass123!');

  describe('create', () => {
    it('should create a user', () => {
      const user = User.create(validEmail, validPassword);
      expect(user).toBeInstanceOf(User);
    });

    it('should assign a unique id', () => {
      const user = User.create(validEmail, validPassword);
      expect(user.id).toBeDefined();
      expect(typeof user.id).toBe('string');
      expect(user.id.length).toBeGreaterThan(0);
    });

    it('should assign the email value object', () => {
      const email = Email.create('bubu@hotmail.com');
      const user = User.create(email, validPassword);
      expect(user.email).toBe(email);
      expect(user.email.value).toBe('bubu@hotmail.com');
    });

    it('should assign the password value object', () => {
      const user = User.create(validEmail, validPassword);
      expect(user.password).toBe(validPassword);
      expect(user.password.value).toBe('StrongPass123!');
    });

    it('should assign USER role by default', () => {
      const user = User.create(validEmail, validPassword);
      expect(user.role).toBe(UserRole.USER);
    });
  });

  describe('restore', () => {
    it('should restore a user from persistence data', () => {
      const user = User.restore(
        'fixed-id-123',
        'persisted@email.com',
        '$argon2hash',
        UserRole.ADMIN,
      );

      expect(user.id).toBe('fixed-id-123');
      expect(user.email.value).toBe('persisted@email.com');
      expect(user.password.value).toBe('$argon2hash');
      expect(user.role).toBe(UserRole.ADMIN);
    });

    it('should not validate password on restore', () => {
      expect(() =>
        User.restore('id', 'e@e.com', 'weak', UserRole.USER),
      ).not.toThrow();
    });

    it('should validate email on restore', () => {
      expect(() =>
        User.restore('id', 'invalid', 'hash', UserRole.USER),
      ).toThrow('Invalid Email Format');
    });
  });

  describe('changeEmail', () => {
    it('should change the email', () => {
      const user = User.create(validEmail, validPassword);
      const newEmail = Email.create('new@email.com');
      user.changeEmail(newEmail);
      expect(user.email.value).toBe('new@email.com');
    });
  });

  describe('changePassword', () => {
    it('should change the password', () => {
      const user = User.create(validEmail, validPassword);
      const newPassword = Password.fromHash('$newhash');
      user.changePassword(newPassword);
      expect(user.password.value).toBe('$newhash');
    });
  });

  describe('changeRole', () => {
    it('should change the role to ADMIN', () => {
      const user = User.create(validEmail, validPassword);
      user.changeRole(UserRole.ADMIN);
      expect(user.role).toBe(UserRole.ADMIN);
    });

    it('should change the role back to USER', () => {
      const user = User.restore('id', 'e@e.com', 'hash', UserRole.ADMIN);
      user.changeRole(UserRole.USER);
      expect(user.role).toBe(UserRole.USER);
    });
  });
});
