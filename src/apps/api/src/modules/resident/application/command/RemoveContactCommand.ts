export class RemoveContactCommand {
    constructor(
        public readonly id: string,
        public readonly contactId: string
    ) {}
}
