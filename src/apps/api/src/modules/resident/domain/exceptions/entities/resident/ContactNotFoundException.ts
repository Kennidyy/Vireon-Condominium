import { DomainException } from '../../../../../shared/domain/exceptions/DomainException';

export class ContactNotFoundException extends DomainException {
  readonly code = 'CONTACT_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('Contact not found');
  }
}
