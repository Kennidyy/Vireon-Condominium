export interface PasswordHasher {
  hash(pswd: string): Promise<string>;
}
