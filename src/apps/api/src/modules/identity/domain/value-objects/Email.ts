export class Email {
  static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  readonly #value: string;

  private constructor(value: string) {
    this.#value = value;
  }

  public static create(raw: string): Email {
    if (!raw) {
      throw new Error('Email is required');
    }

    const value = Email.normalize(raw);

    if (!Email.validate(value)) {
      throw new Error('Invalid email');
    }

    return new Email(value);
  }

  private static normalize(raw: string): string {
    return raw.trim().toLowerCase();
  }

  private static validate(value: string): boolean {
    return Email.EMAIL_REGEX.test(value);
  }

  get value(): string {
    return this.#value;
  }

  equals(other: Email): boolean {
    return this.#value === other.#value;
  }
}
