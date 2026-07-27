import { FakePasswordHasher } from './FakePasswordHasher';

describe('FakePasswordHasher', () => {
  let hasher: FakePasswordHasher;

  beforeEach(() => {
    hasher = new FakePasswordHasher();
  });

  it('should hash a password with prefix', async () => {
    const hash = await hasher.hash('MyPassword123!');
    expect(hash).toBe('$hashed_MyPassword123!');
  });

  it('should compare correct password', async () => {
    const hash = await hasher.hash('MyPassword123!');
    const match = await hasher.compare('MyPassword123!', hash);
    expect(match).toBe(true);
  });

  it('should reject wrong password', async () => {
    const hash = await hasher.hash('MyPassword123!');
    const match = await hasher.compare('WrongPassword!', hash);
    expect(match).toBe(false);
  });
});
