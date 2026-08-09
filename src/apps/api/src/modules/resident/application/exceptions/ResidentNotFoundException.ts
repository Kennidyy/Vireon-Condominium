import { DomainException } from '../../../shared/domain/exceptions/DomainException';

export class ResidentNotFoundException extends DomainException {
  readonly code = 'RESIDENT_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('Resident not found');
  }
}
