import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { ResidentRepository } from "../ports/ResidentRespository";
import { SetPrimaryContactCommand } from "../command/SetPrimaryContactCommand";

@Injectable()
export class SetPrimaryContactUseCase {
    constructor(
        @Inject('ResidentRepository')
        private readonly residentRepository: ResidentRepository
    ) {}

    async execute(command: SetPrimaryContactCommand) {
        const resident = await this.residentRepository.getById(command.id)

        if(!resident) {
            throw new Error('Resident not found')
        }

        resident.setPrimaryContact(command.contactId)

        await this.residentRepository.update(resident)

        return resident
    }
}
