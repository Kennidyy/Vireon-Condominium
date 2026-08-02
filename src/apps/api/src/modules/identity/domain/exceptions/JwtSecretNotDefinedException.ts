import { DomainException } from './DomainException';

export class JwtSecretNotDefinedException extends DomainException {
  readonly code = 'JWT_SECRET_NOT_DEFINED';

  constructor() {
    super('JWT_SECRET is not defined');
  }
}
