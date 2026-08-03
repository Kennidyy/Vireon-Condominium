import { DomainException } from '../../DomainException';

export class InvalidPhoneException extends DomainException {
  readonly code = 'INVALID_PHONE';

  constructor() {
    super('Invalid phone format');
  }
}
