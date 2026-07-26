import { UserRole } from '../enum/UserRole';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';

export class User {
  #id: string;
  #email: Email;
  #password: Password;
  #role: UserRole;

  private constructor(
    id: string,
    email: Email,
    password: Password,
    role: UserRole,
  ) {
    this.#id = id;
    this.#email = email;
    this.#password = password;
    this.#role = role;
  }

  public static create(email: Email, password: Password): User {
    return new User(
      crypto.randomUUID(),
      email,
      password,
      UserRole.USER,
    );
  }

  public static restore(
    id: string,
    email: string,
    password: string,
    role: UserRole,
  ): User {
    return new User(
      id,
      Email.create(email),
      Password.fromHash(password),
      role,
    );
  }

  changeEmail(email: Email): void {
    this.#email = email;
  }

  changePassword(password: Password): void {
    this.#password = password;
  }

  changeRole(role: UserRole): void {
    this.#role = role;
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

  get role(): UserRole {
    return this.#role;
  }
}