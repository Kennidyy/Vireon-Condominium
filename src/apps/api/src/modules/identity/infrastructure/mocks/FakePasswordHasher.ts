import { PasswordHasher } from '../../application/ports/PasswordHasher';

export class FakePasswordHasher implements PasswordHasher {
  hash(value: string): Promise<string> {
    const pswd = `$hashed_${value}`;

    return Promise.resolve(pswd);
  }

  compare(value: string, hashed: string): Promise<boolean> {
    const pswd = `$hashed_${value}`;

    return Promise.resolve(pswd === hashed);
  }
}
