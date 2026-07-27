export class ResidentId {
  readonly #value: string;

  private constructor(value: string) {
    this.#value = value;
  }

  public static generate(): ResidentId {
    return new ResidentId(crypto.randomUUID());
  }

  public static create(value: string): ResidentId {
    if (!ResidentId.validate(value)) {
      throw new Error('Invalid ResidentId');
    }

    return new ResidentId(value);
  }

  private static validate(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  get value(): string {
    return this.#value;
  }

  equals(other: ResidentId): boolean {
    return this.#value === other.value;
  }
}
