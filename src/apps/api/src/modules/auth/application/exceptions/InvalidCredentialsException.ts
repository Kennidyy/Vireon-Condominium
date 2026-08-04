export class InvalidCredentialsException extends Error {
  readonly code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Email or password are wrong');
    this.name = this.constructor.name;
  }
}