import { InvalidPhoneException } from '../exceptions/value-objects/phone/InvalidPhoneException';
import { PhoneIsRequiredException } from '../exceptions/value-objects/phone/PhoneIsRequiredException';

export class Phone {
  static readonly BRAZIL_MOBILE_REGEX = /^\+55\d{2}9\d{8}$/;

  #value: string;

  private constructor(value: string) {
    this.#value = value;
  }

  public static create(raw: string): Phone {
    const phone = Phone.normalize(raw);

    Phone.validate(phone);

    return new Phone(phone);
  }

  private static normalize(raw: string): string {
    return raw.trim();
  }

  private static validate(value: string): void {
    if (!value) {
      throw new PhoneIsRequiredException();
    }

    if (!this.BRAZIL_MOBILE_REGEX.test(value)) {
      throw new InvalidPhoneException();
    }
  }

  get value(): string {
    return this.#value;
  }

  equals(other: Phone): boolean {
    return this.#value === other.value;
  }
}
