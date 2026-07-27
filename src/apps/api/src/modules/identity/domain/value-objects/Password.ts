import { PasswordIsRequiredException } from '../exceptions/value-objects/password/PasswordIsRequiredException';
import { PasswordLowerCaseException } from '../exceptions/value-objects/password/PasswordLowerCaseException';
import { PasswordMinLengthException } from '../exceptions/value-objects/password/PasswordMinLengthException';
import { PasswordNumberException } from '../exceptions/value-objects/password/PasswordNumberException';
import { PasswordSpecialException } from '../exceptions/value-objects/password/PasswordSpecialException';
import { PasswordUpperCaseException } from '../exceptions/value-objects/password/PasswordUpperCaseException';

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
      throw new PasswordIsRequiredException();
    }

    if (pswd.length < 10) {
      throw new PasswordMinLengthException();
    }

    if (!/[A-Z]/.test(pswd)) {
      throw new PasswordUpperCaseException();
    }

    if (!/[a-z]/.test(pswd)) {
      throw new PasswordLowerCaseException();
    }

    if (!/[0-9]/.test(pswd)) {
      throw new PasswordNumberException();
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pswd)) {
      throw new PasswordSpecialException();
    }
  }

  get value(): string {
    return this.#value;
  }
}
