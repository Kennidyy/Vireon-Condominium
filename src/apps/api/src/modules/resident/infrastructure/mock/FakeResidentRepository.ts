import { ResidentRepository } from "../../application/ports/ResidentRespository";
import { Resident } from "../../domain/entities/Resident";

export class FakeResidentRepository implements ResidentRepository {

    private residents: Resident[] = []

    async save(resident: Resident): Promise<void> {
        this.residents.push(resident)
    }

    async update(resident: Resident): Promise<void> {
        const index = this.residents.findIndex(r => r.id === resident.id)
        if (index >= 0) {
            this.residents[index] = resident
        }
    }

    async getByName(name: string): Promise<Resident[]> {
        return this.residents.filter(resident => {
            return resident.name.toLowerCase().includes(name.toLowerCase())
        })
    }

    async getById(id: string): Promise<Resident | null> {
        const resident = this.residents.find(resident => {
            return resident.id === id
        })

        return resident ?? null
    }

    async getAll(): Promise<Resident[]> {
        return this.residents
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
