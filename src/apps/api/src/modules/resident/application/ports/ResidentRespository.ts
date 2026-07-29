import { Resident } from "../../domain/entities/Resident";

export interface ResidentRepository {
    save(resident: Resident): Promise<void>
    update(resident: Resident): Promise<void>
    findByName(name: string): Promise<Resident | null>
    findById(id: string): Promise<Resident | null>
    getAll(): Promise<Resident[]>
    delete(id: string): Promise<void>
}