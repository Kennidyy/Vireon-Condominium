import { DomainException } from '../../../../../shared/domain/exceptions/DomainException';

export class InvalidImageTypeException extends DomainException {
  readonly code = 'INVALID_IMAGE_TYPE';

  constructor() {
    super('Invalid image type');
  }
}
