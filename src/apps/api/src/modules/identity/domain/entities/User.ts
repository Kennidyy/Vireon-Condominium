import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';

export class User {
  #id: string;
  #email: Email;
  #password: Password;

  private constructor(id: string, email: Email, password: Password) {
    this.#id = id;
    this.#email = email;
    this.#password = password;
  }

  public static create(email: Email, password: Password): User {
    return new User(crypto.randomUUID(), email, password);
  }

  public static restore(id: string, email: string, password: string): User {
    return new User(id, Email.create(email), Password.fromHash(password));
  }

  changeEmail(email: Email): void {
    this.#email = email;
  }

  changePassword(password: Password): void {
    this.#password = password;
  }

  get id(): string {
    return this.#id;
  }

  get email(): Email {
    return this.#email;
  }

  get password(): Password {
    return this.#password;
  }
}
