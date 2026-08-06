import { DomainException } from '../../../shared/domain/exceptions/DomainException';

export class EmailAlreadyInUseException extends DomainException {
  readonly code = 'EMAIL_ALREADY_IN_USE';
  readonly statusCode = 409;

  constructor() {
    super('This email is already in use');
  }
}
