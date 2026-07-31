import { InvalidUuidException } from '../exceptions/value-objects/uuid/InvalidUuidException';

export class Uuid {
  readonly #value: string;

  private constructor(value: string) {
    this.#value = value;
  }

  public static generate(): Uuid {
    return new Uuid(crypto.randomUUID());
  }

  public static create(value: string): Uuid {
    if (!Uuid.validate(value)) {
      throw new InvalidUuidException();
    }

    return new Uuid(value);
  }

  private static validate(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  get value(): string {
    return this.#value;
  }

  equals(other: Uuid): boolean {
    return this.#value === other.value;
  }
}
