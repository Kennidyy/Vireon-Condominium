export abstract class DomainException extends Error {
  abstract readonly code: string;

  readonly statusCode: number = 400;

  constructor(msg: string) {
    super(msg);
    this.name = this.constructor.name;
  }
}
