import { ProfilePhoto } from "../../domain/entities/ProfilePhoto";

export class CreateResidentCommand {
    constructor(
        public readonly userId: string,
        public readonly name: string,
    ) {}
}