import { DomainException } from '../../../../../shared/domain/exceptions/DomainException';

export class PersonNameIsRequiredException extends DomainException {
  readonly code = 'NAME_IS_REQUIRED';

  constructor() {
    super('Name is required');
  }
}
