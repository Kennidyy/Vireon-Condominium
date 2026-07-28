export class CreateResidentCommand {
    constructor(
        public readonly id: string,
        public readonly name: string,
    ) {}
}