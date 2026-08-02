import { DomainException } from './DomainException';
import { JwtSecretNotDefinedException } from './JwtSecretNotDefinedException';

describe('JwtSecretNotDefinedException', () => {
  it('should expose the JWT secret missing error details', () => {
    const exception = new JwtSecretNotDefinedException();

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.name).toBe('JwtSecretNotDefinedException');
    expect(exception.code).toBe('JWT_SECRET_NOT_DEFINED');
    expect(exception.message).toBe('JWT_SECRET is not defined');
  });
});
