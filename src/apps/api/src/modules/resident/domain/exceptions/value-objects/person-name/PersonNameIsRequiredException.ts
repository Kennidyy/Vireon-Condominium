import { DomainException } from '../../DomainException';

export class PersonNameIsRequiredException extends DomainException {
  readonly code = 'NAME_IS_REQUIRED';

  constructor() {
    super('Name is required');
  }
}
