import { InvalidPersonNameException } from '../exceptions/value-objects/person-name/InvalidPersonNameException';
import { PersonNameIsRequiredException } from '../exceptions/value-objects/person-name/PersonNameIsRequiredException';
import { PersonNameTooLargeException } from '../exceptions/value-objects/person-name/PersonNameTooLargeException';

export class PersonName {
  readonly #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  public static create(raw: string): PersonName {
    const name = PersonName.normalize(raw);

    PersonName.validate(name);

    return new PersonName(name);
  }

  private static normalize(raw: string) {
    return raw.trim().replace(/\s+/g, ' '); // Remove double space inside a string
  }

  private static validate(value: string): void {
    const NAME_REGEX = /^[\p{L}' -]+$/u;

    if (!value) {
      throw new PersonNameIsRequiredException();
    }

    if (!NAME_REGEX.test(value)) {
      throw new InvalidPersonNameException();
    }

    if (value.length > 255) {
      throw new PersonNameTooLargeException();
    }
  }

  get value(): string {
    return this.#value;
  }

  equals(other: PersonName) {
    return this.#value === other.#value;
  }
}
