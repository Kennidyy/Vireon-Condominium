export interface AuthPasswordHasher {
  compare(pswd: string, hash: string): Promise<boolean>;
}
