import { DomainException } from '../../domain/exceptions/DomainException';

export class ResidentAlreadyExistsException extends DomainException {
  readonly code = 'RESIDENT_ALREADY_EXISTS';

  constructor() {
    super('Resident already exists');
  }
}
