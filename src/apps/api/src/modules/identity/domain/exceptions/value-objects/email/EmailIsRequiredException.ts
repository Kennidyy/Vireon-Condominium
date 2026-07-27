import { DomainException } from "../../DomainException";

export class EmailIsRequiredException extends DomainException {
    readonly code = 'EMAIL_IS_REQUIRED'

    constructor() {
        super('Email is required')
    }

}