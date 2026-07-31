import { DomainException } from '../../DomainException';

export class ContactNotFoundException extends DomainException {
  readonly code = 'CONTACT_NOT_FOUND';

  constructor() {
    super('Contact not found');
  }
}
