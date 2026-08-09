import { UserRole } from '../../domain/enum/UserRole';

export class SetPrimaryContactCommand {
  constructor(
    public readonly id: string,
    public readonly contactId: string,
    public readonly authenticatedUserId: string,
    public readonly authenticatedRole: UserRole,
  ) {}
}
