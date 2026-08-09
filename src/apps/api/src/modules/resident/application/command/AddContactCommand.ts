import { UserRole } from '../../domain/enum/UserRole';

export class AddContactCommand {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly value: string,
    public readonly authenticatedUserId: string,
    public readonly authenticatedRole: UserRole,
  ) {}
}
