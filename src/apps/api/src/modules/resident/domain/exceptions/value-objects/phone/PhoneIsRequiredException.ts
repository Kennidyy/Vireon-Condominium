import { DomainException } from '../../../../../shared/domain/exceptions/DomainException';

export class PhoneIsRequiredException extends DomainException {
  readonly code = 'PHONE_IS_REQUIRED';

  constructor() {
    super('Phone number is required');
  }
}
