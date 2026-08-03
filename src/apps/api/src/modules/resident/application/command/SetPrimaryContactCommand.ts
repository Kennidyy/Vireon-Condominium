export class SetPrimaryContactCommand {
  constructor(
    public readonly id: string,
    public readonly contactId: string,
  ) {}
}
