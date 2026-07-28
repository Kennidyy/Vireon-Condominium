import { ContactType } from '../enum/ContactType';
import { Email } from '../value-objects/Email';
import { Phone } from '../value-objects/Phone';
import { Uuid } from '../value-objects/Uuid';

export class Contact {

  readonly #id: Uuid;
  readonly #type: ContactType;

  #value: string;
  #isPrimary: boolean;

  private constructor(
    id: Uuid,
    type: ContactType,
    value: string,
    isPrimary: boolean,
  ) {
    this.#id = id;
    this.#type = type;
    this.#value = value;
    this.#isPrimary = isPrimary;
  }

  public static create(
    type: ContactType,
    raw: string,
    isPrimary = false,
  ): Contact {
    const value = raw.trim();

    Contact.validate(value, type);

    return new Contact(
      Uuid.generate(),
      type,
      value,
      isPrimary
    );
  }

  public static restore(
        id: string,
        type: ContactType,
        value: string,
        isPrimary: boolean
    ): Contact {
        return new Contact(
            Uuid.create(id),
            type,
            value,
            isPrimary
        );
    }

  public changeValue(rawValue: string): void {
    const value = rawValue.trim();

    Contact.validate(value, this.#type);

    this.#value = value;
  }

  public changePrimaryStatus(value: boolean): void {
    this.#isPrimary = value;
  }

  private static validate(value: string, type: ContactType) {
    switch (type) {
      case ContactType.EMAIL:
        Email.create(value);
        break;

      case ContactType.PHONE:
        Phone.create(value);
        break;
    }
  }

  get id(): string {
    return this.#id.value;
  }

  get value(): string {
    return this.#value;
  }

  get type(): ContactType {
    return this.#type;
  }

  get isPrimary(): boolean {
    return this.#isPrimary;
  }
}
