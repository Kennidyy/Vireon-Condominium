export class ContactId {
  readonly #value: string;

  private constructor(value: string) {
    this.#value = value;
  }

  public static generate(): ContactId {
    return new ContactId(crypto.randomUUID());
  }

  public static create(value: string): ContactId {
    if (!ContactId.validate(value)) {
      throw new Error('Invalid ResidentId');
    }

    return new ContactId(value);
  }

  private static validate(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  get value(): string {
    return this.#value;
  }

  equals(other: ContactId): boolean {
    return this.#value === other.value;
  }
}
