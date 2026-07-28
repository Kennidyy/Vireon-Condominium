import { Inject, Injectable } from "@nestjs/common";
import type { ResidentRepository } from "../ports/ResidentRespository";
import { CreateResidentCommand } from "../command/CreateResidentCommand";
import { Resident } from "../../domain/entities/Resident";
import { PersonName } from "../../domain/value-objects/PersonName";
import { ProfilePhoto } from "../../domain/entities/ProfilePhoto";

@Injectable()
export class CreateResidentUseCase {

    constructor(
        @Inject('FakeResidentRepository')
        private readonly residentRepository: ResidentRepository
    ) {}

    async execute(dto: CreateResidentCommand): Promise<void> {

        const resident = Resident.create(
            PersonName.create(dto.name),
            ProfilePhoto.create(dto.profilePhoto, 'PNG', 5.00)
        )

        await this.residentRepository.save(resident) 
    }

}