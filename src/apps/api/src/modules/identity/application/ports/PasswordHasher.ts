export interface PasswordHasher {
  hash(pswd: string): Promise<string>;
  compare(pswd: string, hashed: string): Promise<boolean>;
}
