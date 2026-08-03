import { DomainException } from '../../DomainException';

export class InvalidPersonNameException extends DomainException {
  readonly code = 'INVALID_NAME';

  constructor() {
    super('Name cannot contain numbers');
  }
}
