import { AuthUser } from '../../domain/entity/AuthUser';

export interface IdentityProvider {
  getByEmail(email: string): Promise<AuthUser | null>;
}
