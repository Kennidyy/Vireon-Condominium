import { Inject, Injectable } from "@nestjs/common";
import type { ResidentRepository } from "../ports/ResidentRespository";
import { CreateResidentCommand } from "../command/CreateResidentCommand";
import { Resident } from "../../domain/entities/Resident";
import { PersonName } from "../../domain/value-objects/PersonName";
import { ProfilePhoto } from "../../domain/entities/ProfilePhoto";
import { FakeResidentRepository } from "../../infrastructure/repositories/mock/FakeResidenteRepository";
import { Uuid } from "../../domain/value-objects/Uuid";

@Injectable()
export class CreateResidentUseCase {

    constructor(
        @Inject('ResidentRepository')
        private readonly residentRepository: FakeResidentRepository
    ) {}

    async execute(command: CreateResidentCommand): Promise<void> {
        const resident = Resident.create(
            command.id,
            Uuid.generate(),
            PersonName.create(command.name),
        )

        await this.residentRepository.save(resident) 
    }

}