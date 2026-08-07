import { UserRole } from '../../domain/enum/UserRole';

export class UpdateContactValueCommand {
  constructor(
    public readonly id: string,
    public readonly contactId: string,
    public readonly value: string,
    public readonly authenticatedUserId: string,
    public readonly authenticatedRole: UserRole,
  ) {}
}
