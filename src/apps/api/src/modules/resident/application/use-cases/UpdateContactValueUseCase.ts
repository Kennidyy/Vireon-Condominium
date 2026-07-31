import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { ResidentRepository } from "../ports/ResidentRespository";
import { UpdateContactValueCommand } from "../command/UpdateContactValueCommand";

@Injectable()
export class UpdateContactValueUseCase {
    constructor(
        @Inject('ResidentRepository')
        private readonly residentRepository: ResidentRepository
    ) {}

    async execute(command: UpdateContactValueCommand) {
        const resident = await this.residentRepository.getById(command.id)

        if(!resident) {
            throw new Error('Resident not found')
        }

        resident.changeContactValue(command.contactId, command.value)

        await this.residentRepository.update(resident)

        return resident
    }
}
