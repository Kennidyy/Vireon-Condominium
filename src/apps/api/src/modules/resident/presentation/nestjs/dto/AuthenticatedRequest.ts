import { UserRole } from '../../../domain/enum/UserRole';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: UserRole;
  };
}
