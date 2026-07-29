import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/database/prisma/prisma.service";
import { ResidentRepository } from "../../application/ports/ResidentRespository";
import { Resident } from "../../domain/entities/Resident";
import { ResidentMapper } from "../mappers/ResidentMapper";
import { User } from "../../../identity/domain/entities/User";

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
        const residents = await this.prismaService.resident.findMany({
            include: {
                user: true,
                profilePhoto: true,
                contacts: true
            }
        })

        return residents.map((resident) => {

            if (!resident.profilePhoto) {
                throw new Error("Resident without profile photo");
            }

            return ResidentMapper.toDomain(
                resident.id,
                resident.userId,
                resident.name,
                resident.profilePhoto,
                resident.contacts
            )
        }
        )
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}