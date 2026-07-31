export class UpdateContactValueCommand {
    constructor(
        public readonly id: string,
        public readonly contactId: string,
        public readonly value: string
    ) {}
}
