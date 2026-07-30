import { UserRole } from "../enum/UserRole";

export class AuthUser {
    constructor(
        public readonly id: string,
        public readonly passwordHash: string,
        public readonly role: UserRole
    ) {}

}