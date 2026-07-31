export class AddContactCommand {
    constructor(
        public readonly id: string,
        public readonly type: string,
        public readonly value: string
    ) {}
}
