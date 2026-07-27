import { DomainException } from '../../DomainException';

export class PasswordNumberException extends DomainException {
  readonly code = 'PASSWORD_NUMBER';

  constructor() {
    super('Password must contain at least one number');
  }
}
