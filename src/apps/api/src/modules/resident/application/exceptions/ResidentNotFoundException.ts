import { DomainException } from '../../domain/exceptions/DomainException';

export class ResidentNotFoundException extends DomainException {
  readonly code = 'RESIDENT_NOT_FOUND';

  constructor() {
    super('Resident not found');
  }
}
