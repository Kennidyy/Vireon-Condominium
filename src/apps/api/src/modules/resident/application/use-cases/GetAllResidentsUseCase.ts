import { Inject, Injectable } from "@nestjs/common";
import { FakeResidentRepository } from "../../infrastructure/repositories/mock/FakeResidenteRepository";
import { Resident } from "../../domain/entities/Resident";
import { ResidentResponseDto } from "../../presentation/nestjs/dto/ResidentResponseDto";

@Injectable()
export class GetAllResidentsUseCase {
    constructor(
        @Inject('ResidentRepository')
        private readonly residentRepository: FakeResidentRepository
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