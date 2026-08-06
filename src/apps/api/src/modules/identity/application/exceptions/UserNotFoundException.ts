import { DomainException } from '../../../shared/domain/exceptions/DomainException';

export class UserNotFoundException extends DomainException {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('User not found');
  }
}
