import { DomainException } from '../../../../../shared/domain/exceptions/DomainException';

export class PersonNameTooLargeException extends DomainException {
  readonly code = 'NAME_TOO_LARGE';

  constructor() {
    super('Name is too large');
  }
}
