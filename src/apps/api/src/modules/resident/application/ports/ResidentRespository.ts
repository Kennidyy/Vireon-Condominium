import { Resident } from '../../domain/entities/Resident';

export interface ResidentRepository {
  save(resident: Resident): Promise<void>;
  update(resident: Resident): Promise<void>;
  getByName(name: string): Promise<Resident[]>;
  getById(userId: string): Promise<Resident | null>;
  getAll(): Promise<Resident[]>;
  delete(id: string): Promise<void>;
}
