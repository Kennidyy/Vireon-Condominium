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

  public static create(id: string, email: Email, password: Password): User {
    return new User(id, email, password);
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
