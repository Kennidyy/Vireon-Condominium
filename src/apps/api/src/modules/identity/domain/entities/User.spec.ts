import { User } from './User';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';

describe('User Entity', () => {
  it('should create a user', () => {
    const email = Email.create('niko@gmail.com');
    const password = Password.create('Senha123@!');

    const user = User.create(email, password);

    expect(user).toBeInstanceOf(User);
  });

  it('should assign the user id', () => {
    const email = Email.create('baa@gmail.com');
    const password = Password.create('StrongPass123!');

    const user = User.create(email, password);

    expect(user.id).toBeDefined();
    expect(typeof user.id).toBe('string');
    expect(user.id.length).toBeGreaterThan(0);
  });

  it('should assign the email value object', () => {
    const email = Email.create('bubu@hotmail.com');
    const password = Password.create('Strongpass5432!');

    const user = User.create(email, password);

    expect(user.email).toBe(email);
    expect(user.email.value).toBe('bubu@hotmail.com');
  });

  it('should assign the password value object', () => {
    const email = Email.create('user@email.com');
    const password = Password.create('StrongPass123!');

    const user = User.create(email, password);

    expect(user.password).toBe(password);
    expect(user.password.value).toBe('StrongPass123!');
  });
});
