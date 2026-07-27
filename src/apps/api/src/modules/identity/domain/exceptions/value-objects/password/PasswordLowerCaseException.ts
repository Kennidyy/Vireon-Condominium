import { DomainException } from "../../DomainException";

export class PasswordLowerCaseException extends DomainException {
    readonly code = 'PASSWORD_LOWER_CASE'

    constructor() {
        super('Password must contain at least one lowercase letter')
    }
}