import { DomainException } from '../../../../../shared/domain/exceptions/DomainException';

export class ResidentMaxContactsExceededException extends DomainException {
  readonly code = 'RESIDENT_MAX_CONTACTS';

  constructor() {
    super('Resident cannot have more than 10 contacts');
  }
}
