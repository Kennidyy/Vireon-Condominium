import { ImageType } from '../enum/ImageType';
import { Uuid } from '../value-objects/Uuid';
import { ImageExceedsMaxSizeException } from '../exceptions/entities/profile-photo/ImageExceedsMaxSizeException';
import { InvalidImageTypeException } from '../exceptions/entities/profile-photo/InvalidImageTypeException';
import { StorageKeyIsRequiredException } from '../exceptions/entities/profile-photo/StorageKeyIsRequiredException';

export class ProfilePhoto {
  private static readonly MAX_SIZE = 5 * 1024 * 1024;

  readonly #id: Uuid;
  readonly #storageKey: string;
  readonly #contentType: ImageType;
  readonly #size: number;

  private constructor(
    id: Uuid,
    storageKey: string,
    contentType: ImageType,
    size: number,
  ) {
    this.#id = id;
    this.#storageKey = storageKey;
    this.#contentType = contentType;
    this.#size = size;
  }

  public static create(
    storageKey: string,
    contentType: ImageType,
    size: number,
  ): ProfilePhoto {
    if (contentType !== ImageType.PNG && contentType !== ImageType.JPEG) {
      throw new InvalidImageTypeException();
    }

    if (size > ProfilePhoto.MAX_SIZE) {
      throw new ImageExceedsMaxSizeException();
    }

    if (!storageKey) {
      throw new StorageKeyIsRequiredException();
    }

    return new ProfilePhoto(Uuid.generate(), storageKey, contentType, size);
  }

  public static restore(
    id: string,
    storageKey: string,
    contentType: ImageType,
    size: number,
  ) {
    return new ProfilePhoto(Uuid.create(id), storageKey, contentType, size);
  }

  static default() {
    return ProfilePhoto.create('defaults/profile.jpg', ImageType.JPEG, 124000);
  }

  get id(): string {
    return this.#id.value;
  }

  get storageKey(): string {
    return this.#storageKey;
  }

  get contentType(): string {
    return this.#contentType;
  }

  get size(): number {
    return this.#size;
  }
}
