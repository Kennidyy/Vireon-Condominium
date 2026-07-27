import { DomainException } from '../../domain/exceptions/DomainException';

export class UserNotFoundException extends DomainException {
  readonly code = 'USER_NOT_FOUND';

  constructor() {
    super('User not found');
  }
}
