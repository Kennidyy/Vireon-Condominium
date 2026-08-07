import { UserRole } from '../../domain/enum/UserRole';
import { ResidentAccessDeniedException } from '../exceptions/ResidentAccessDeniedException';

export class ResidentAccessPolicy {
  static assertCanMutate(
    ownerId: string,
    subjectId: string,
    role: UserRole,
  ): void {
    if (role === UserRole.ADMIN) {
      return;
    }

    if (ownerId !== subjectId) {
      throw new ResidentAccessDeniedException();
    }
  }
}
