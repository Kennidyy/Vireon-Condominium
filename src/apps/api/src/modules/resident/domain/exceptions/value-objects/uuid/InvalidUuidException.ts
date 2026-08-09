import { DomainException } from '../../../../../shared/domain/exceptions/DomainException';

export class InvalidUuidException extends DomainException {
  readonly code = 'INVALID_UUID';

  constructor() {
    super('Invalid Uuid');
  }
}
