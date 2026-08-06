import { DomainException } from '../../../../../shared/domain/exceptions/DomainException';

export class PasswordIsRequiredException extends DomainException {
  readonly code = 'PASSWORD_IS_REQUIRED';

  constructor() {
    super('Password is required');
  }
}
