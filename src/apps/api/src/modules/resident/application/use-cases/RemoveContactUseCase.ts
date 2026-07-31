import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { ResidentRepository } from "../ports/ResidentRespository";
import { RemoveContactCommand } from "../command/RemoveContactCommand";

@Injectable()
export class RemoveContactUseCase {
    constructor(
        @Inject('ResidentRepository')
        private readonly residentRepository: ResidentRepository
    ) {}

    async execute(command: RemoveContactCommand) {
        const resident = await this.residentRepository.getById(command.id)

        if(!resident) {
            throw new Error('Resident not found')
        }

        resident.removeContact(command.contactId)

        await this.residentRepository.update(resident)

        return resident
    }
}
