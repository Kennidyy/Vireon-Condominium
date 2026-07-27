import { UserRole } from '../../domain/enum/UserRole';

export interface TokenPayload {
  sub: string;
  email?: string;
  role: UserRole;
}
