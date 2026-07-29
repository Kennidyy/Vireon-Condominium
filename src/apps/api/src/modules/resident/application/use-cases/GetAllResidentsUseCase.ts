import { Inject, Injectable } from "@nestjs/common";
import { Resident } from "../../domain/entities/Resident";
import { ResidentResponseDto } from "../../presentation/nestjs/dto/ResidentResponseDto";
import { PrismaResidentRepository } from "../../infrastructure/repositories/PrismaResidentRepository";

@Injectable()
export class GetAllResidentsUseCase {
    constructor(
        @Inject('ResidentRepository')
        private readonly residentRepository: PrismaResidentRepository
    ) {}

    async execute(): Promise<ResidentResponseDto[]> {
        const residents = await this.residentRepository.getAll()

        return residents.map(resident => 
            new ResidentResponseDto(
                resident.id,
                resident.name
            )
        )
    }
}