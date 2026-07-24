import { Argon2PasswordHasher } from './Argon2PasswordHasher';

describe('Argon2 password hasher', () => {
  it('should hash a password', async () => {
    const passwordHasher = new Argon2PasswordHasher();
    const pswd = 'Senha1234@#@';
    const hashedPassword = await passwordHasher.hash(pswd);
    console.log('hashedPassword', hashedPassword);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toEqual(pswd);
  });
});
