import { DomainException } from '../../domain/exceptions/DomainException';

export class EmailAlreadyInUseException extends DomainException {
  readonly code = 'EMAIL_ALREADY_IN_USE';

  constructor() {
    super('This email is already in use');
  }
}
