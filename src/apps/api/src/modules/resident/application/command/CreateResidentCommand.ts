export class CreateResidentCommand {
    constructor(
        public readonly userId: string,
        public readonly profilePhoto: string,
        public readonly name: string
    ) {}
}