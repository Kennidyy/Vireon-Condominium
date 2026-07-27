import { DomainException } from '../../DomainException';

export class PasswordUpperCaseException extends DomainException {
  readonly code = 'PASSWORD_UPPER_CASE';

  constructor() {
    super('Password must contain at least one uppercase letter');
  }
}
