import { DomainException } from '../../domain/exceptions/DomainException';

export class InvalidCredentialException extends DomainException {
  constructor() {
    super('Email or password are wrong');
  }

  readonly code = 'INVALID_CREDENTIALS';
}
