import { DomainException } from '../../../shared/domain/exceptions/DomainException';

export class ResidentAlreadyExistsException extends DomainException {
  readonly code = 'RESIDENT_ALREADY_EXISTS';
  readonly statusCode = 409;

  constructor() {
    super('Resident already exists');
  }
}
