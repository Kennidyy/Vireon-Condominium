import { Password } from './Password';

describe('Password Value Object', () => {
  it('should create a valid password', () => {
    const password = Password.create('Senha123#!!');

    expect(password.value).toBe('Senha123#!!');
  });

  it('should create a password from hash', () => {
    const hash = '$argon2id$v=19$m=65536,t=3,p=4$hash';

    const password = Password.fromHash(hash);

    expect(password.value).toBe(hash);
  });

  it('should reject empty password', () => {
    expect(() => {
      Password.create('');
    }).toThrow('Password is required');
  });

  it('should reject password shorter than 10 characters', () => {
    expect(() => {
      Password.create('Ab1!');
    }).toThrow('Password must have at least 10 characters');
  });

  it('should reject password without uppercase letter', () => {
    expect(() => {
      Password.create('supersenha!');
    }).toThrow('Password must contain at least one uppercase letter');
  });

  it('should reject password without lowercase letter', () => {
    expect(() => {
      Password.create('BATATA123!');
    }).toThrow('Password must contain at least one lowercase letter');
  });

  it('should reject password without number', () => {
    expect(() => {
      Password.create('CadeONumero!');
    }).toThrow('Password must contain at least one number');
  });

  it('should reject password without special character', () => {
    expect(() => {
      Password.create('FaltaOSimboloFI12');
    }).toThrow('Password must contain at least one special character');
  });
});
