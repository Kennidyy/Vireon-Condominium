import { DomainException } from "../../DomainException";

export class InvalidEmailFormatException extends DomainException {

    readonly code = 'INVALID_EMAIL_FORMAT'

    constructor() {
        super('Invalid Email Format')
    }

}