import { DomainException } from '../../DomainException';

export class PasswordSpecialException extends DomainException {
  readonly code = 'PASSWORD_SPECIAL_CHAR';

  constructor() {
    super('Password must contain at least one special character');
  }
}
