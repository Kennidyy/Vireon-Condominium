import { ResidentRepository } from "../../../application/ports/ResidentRespository";
import { Resident } from "../../../domain/entities/Resident";

export class FakeResidentRepository implements ResidentRepository {

    private residents: Resident[] = []

    async save(resident: Resident): Promise<void> {
        this.residents.push(resident)
    }

    async update(resident: Resident): Promise<void> {
        console.log('sfaf')
    }

    async findByName(name: string): Promise<Resident | null> {
        const resident = this.residents.find(resident => {
            return resident.name === name
        })

        return resident ?? null
    }

    async findById(id: string): Promise<Resident | null> {
        const resident = this.residents.find(resident => {
            return resident.id === id
        })

        return resident ?? null
    }

    async getAll(): Promise<Resident> {
        return this.residents[0]
    }

    async delete(id: string): Promise<void> {
        const index = this.residents.findIndex(
            r => r.id === id
        )
        if(index >= 0) {
            this.residents.splice(index, 1)
        }
    }

}