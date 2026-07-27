import { UserRole } from '../../domain/enum/UserRole';

export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: UserRole;
}
