export class Password {
  readonly #value: string;

  private constructor(pswd: string) {
    this.#value = pswd;
  }

  public static create(pswd: string): Password {
    Password.validate(pswd);
    return new Password(pswd);
  }

  public static fromHash(hash: string): Password {
    return new Password(hash);
  }

  public static validate(pswd: string): void {
    if (!pswd) {
      throw new Error('Password is required');
    }

    if (pswd.length < 10) {
      throw new Error('Password must have at least 10 characters');
    }

    if (!/[A-Z]/.test(pswd)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(pswd)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(pswd)) {
      throw new Error('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pswd)) {
      throw new Error('Password must contain at least one special character');
    }
  }

  get value(): string {
    return this.#value;
  }
}
