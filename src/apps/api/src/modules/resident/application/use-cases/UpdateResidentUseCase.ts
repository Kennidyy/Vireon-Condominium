import { Inject, Injectable } from "@nestjs/common";
import { FakeResidentRepository } from "../../infrastructure/repositories/mock/FakeResidenteRepository";
import { UpdateResidentCommand } from "../command/UpdateResidentCommand";

@Injectable()
export class UpdateResidentUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly residentRepository: FakeResidentRepository
    ) {}

    async execute(command: UpdateResidentCommand) {
        const resident = await this.residentRepository.findById(command.id)

        if(!resident) {
            throw new Error('Resident not found')
        }

        resident.changeName(command.name)

        await this.residentRepository.save(resident)
    }
}