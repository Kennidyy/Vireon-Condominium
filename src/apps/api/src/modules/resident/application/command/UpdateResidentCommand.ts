import { ProfilePhoto } from "../../domain/entities/ProfilePhoto";

export class UpdateResidentCommand {
    constructor(
        public readonly id: string,
        public readonly name: string
    ) {}
}