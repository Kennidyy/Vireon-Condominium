import * as argon2 from "argon2";
import { PasswordHasher } from "../../application/ports/PasswordHasher";

export class Argon2PasswordHasher implements PasswordHasher {
    async hash(pswd: string): Promise<string> {
        return await argon2.hash(pswd);
    }
}