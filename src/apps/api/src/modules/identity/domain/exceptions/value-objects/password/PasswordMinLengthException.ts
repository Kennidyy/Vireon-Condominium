import { DomainException } from "../../DomainException";

export class PasswordMinLengthException extends DomainException {
    readonly code = 'PASSWORD_MIN_LENGTH'

    constructor() {
        super('Password must have at least 10 characters')
    }
}