export abstract class DomainException extends Error {
  abstract readonly code: string;

  constructor(msg: string) {
    super(msg);
    this.name = this.constructor.name;
  }
}
