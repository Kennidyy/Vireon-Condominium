export class ProfilePhotoId {
  readonly #value: string;

  private constructor(value: string) {
    this.#value = value;
  }

  public static generate(): ProfilePhotoId {
    return new ProfilePhotoId(crypto.randomUUID());
  }

  public static create(value: string): ProfilePhotoId {
    if (!ProfilePhotoId.validate(value)) {
      throw new Error('Invalid ProfilePhotoId');
    }

    return new ProfilePhotoId(value);
  }

  private static validate(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  get value(): string {
    return this.#value;
  }

  equals(other: ProfilePhotoId): boolean {
    return this.#value === other.value;
  }
}
