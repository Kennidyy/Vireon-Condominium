import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/database/prisma/prisma.service";
import { ResidentRepository } from "../../application/ports/ResidentRespository";
import { Resident } from "../../domain/entities/Resident";
import { ResidentMapper } from "../mappers/ResidentMapper";

@Injectable()
export class PrismaResidentRepository implements ResidentRepository {

    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async save(resident: Resident): Promise<void> {
        const data = ResidentMapper.toPersistance(resident)

        await this.prismaService.resident.create({ data })
    }

    async update(resident: Resident): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findByName(name: string): Promise<Resident | null> {
        throw new Error("Method not implemented.");
    }

    /*TODO: Lembrar = O UpdateResidentNameUseCase bate aqui
     Implementar findById*/
     
     async findById(id: string): Promise<Resident | null> {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<Resident[]> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}