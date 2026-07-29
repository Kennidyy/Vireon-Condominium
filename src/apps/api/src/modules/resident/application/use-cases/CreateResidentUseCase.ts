import { Inject, Injectable } from "@nestjs/common";
import type { ResidentRepository } from "../ports/ResidentRespository";
import { CreateResidentCommand } from "../command/CreateResidentCommand";
import { Resident } from "../../domain/entities/Resident";
import { PersonName } from "../../domain/value-objects/PersonName";
import { ProfilePhoto } from "../../domain/entities/ProfilePhoto";
import { ImageType } from "../../domain/enum/ImageType";
import { Uuid } from "../../domain/value-objects/Uuid";
import { PrismaResidentRepository } from "../../infrastructure/repositories/PrismaResidentRepository";

@Injectable()
export class CreateResidentUseCase {

    constructor(
        @Inject('ResidentRepository')
        private readonly residentRepository: ResidentRepository
    ) {}

    async execute(command: CreateResidentCommand): Promise<Resident> {

        //TODO: Handle already existing resident
        const resident = Resident.create(
            Uuid.create(command.userId),
            PersonName.create(command.name),
            ProfilePhoto.default()
        )

        await this.residentRepository.save(resident)

        return resident
    }

}