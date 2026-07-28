import { ResidentRepository } from "../../../application/ports/ResidentRespository";
import { Resident } from "../../../domain/entities/Resident";

export class FakeResidentRepository implements ResidentRepository {

    private residents: Resident[] = []

    async save(resident: Resident): Promise<void> {
        this.residents.push(resident)
    }

    async findByName(name: string): Promise<Resident | undefined> {
        const resident = this.residents.find(resident => {
            return resident.name === name
        })

        return resident
    }

    async getAll(): Promise<Resident[]> {
        return this.residents
    }

}