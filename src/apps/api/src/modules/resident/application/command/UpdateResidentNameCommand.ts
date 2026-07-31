export class UpdateResidentCommand {
    constructor(
        public readonly id: string,
        public readonly name: string
    ) {}
}