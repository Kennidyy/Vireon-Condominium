import { Resident } from "../../domain/entities/Resident";

export interface ResidentRepository {
    save(resident: Resident): Promise<void>
    findByName(name: string): Promise<Resident | undefined>
}