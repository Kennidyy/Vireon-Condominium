import { DomainException } from '../../DomainException';

export class StorageKeyIsRequiredException extends DomainException {
  readonly code = 'STORAGE_KEY_IS_REQUIRED';

  constructor() {
    super('Storage key is mandatory');
  }
}
