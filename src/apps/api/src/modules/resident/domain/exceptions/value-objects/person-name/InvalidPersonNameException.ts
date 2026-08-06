import { DomainException } from '../../../../../shared/domain/exceptions/DomainException';

export class InvalidPersonNameException extends DomainException {
  readonly code = 'INVALID_NAME';

  constructor() {
    super('Name cannot contain numbers');
  }
}
