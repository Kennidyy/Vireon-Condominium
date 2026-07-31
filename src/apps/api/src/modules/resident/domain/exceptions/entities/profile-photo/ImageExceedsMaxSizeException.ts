import { DomainException } from '../../DomainException';

export class ImageExceedsMaxSizeException extends DomainException {
  readonly code = 'IMAGE_EXCEEDS_MAX_SIZE';

  constructor() {
    super('Image exceeds max size');
  }
}
