import { Inject, Injectable } from "@nestjs/common";
import { UpdateResidentCommand } from "../command/UpdateResidentNameCommand";
import { PrismaResidentRepository } from "../../infrastructure/repositories/PrismaResidentRepository";

@Injectable()
export class UpdateResidentUseCase {
    constructor(
        @Inject('ResidentRepository')
        private readonly residentRepository: PrismaResidentRepository
    ) {}

    async execute(id: string,command: UpdateResidentCommand) {
        const resident = await this.residentRepository.findById(id)
        console.log(
            resident?.name
        )

        if(!resident) {
            throw new Error('Resident not found')
        }

        resident.changeName(command.name)

        await this.residentRepository.update(resident)
    }
}