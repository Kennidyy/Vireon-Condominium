import { DomainException } from '../../../shared/domain/exceptions/DomainException';

export class ResidentAccessDeniedException extends DomainException {
  readonly code = 'RESIDENT_ACCESS_DENIED';
  readonly statusCode = 403;

  constructor() {
    super('Access denied to this resident');
  }
}
