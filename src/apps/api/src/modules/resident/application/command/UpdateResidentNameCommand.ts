import { ProfilePhoto } from "../../domain/entities/ProfilePhoto";

export class UpdateResidentCommand {
    constructor(
        public readonly name: string
    ) {}
}