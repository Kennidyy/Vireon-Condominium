import { UserRole } from '../../domain/enum/UserRole';

export class RemoveContactCommand {
  constructor(
    public readonly id: string,
    public readonly contactId: string,
    public readonly authenticatedUserId: string,
    public readonly authenticatedRole: UserRole,
  ) {}
}
