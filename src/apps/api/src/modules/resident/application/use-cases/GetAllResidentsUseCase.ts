import { Inject, Injectable } from "@nestjs/common";
import { Resident } from "../../domain/entities/Resident";
import { ResidentResponseDto } from "../../presentation/nestjs/dto/ResidentResponseDto";
import { PrismaResidentRepository } from "../../infrastructure/repositories/PrismaResidentRepository";
import { ResidentMapper } from "../../infrastructure/mappers/ResidentMapper";

@Injectable()
export class GetAllResidentsUseCase {
    constructor(
        @Inject('ResidentRepository')
        private readonly residentRepository: PrismaResidentRepository
    ) {}

    async execute(): Promise<Resident[]> {
        return await this.residentRepository.getAll()
    }
}