import { ResidentRepository } from '../../application/ports/ResidentRepository';
import { Resident } from '../../domain/entities/Resident';

export class FakeResidentRepository implements ResidentRepository {
  private residents: Resident[] = [];

  save(resident: Resident): Promise<void> {
    this.residents.push(resident);
    return Promise.resolve();
  }

  update(resident: Resident): Promise<void> {
    const index = this.residents.findIndex((r) => r.id === resident.id);
    if (index >= 0) {
      this.residents[index] = resident;
    }
    return Promise.resolve();
  }

  getByName(name: string): Promise<Resident[]> {
    return Promise.resolve(
      this.residents.filter((resident) => {
        return resident.name.toLowerCase().includes(name.toLowerCase());
      }),
    );
  }

  getById(id: string): Promise<Resident | null> {
    const resident = this.residents.find((resident) => {
      return resident.id === id;
    });

    return Promise.resolve(resident ?? null);
  }

  getAll(): Promise<Resident[]> {
    return Promise.resolve(this.residents);
  }

  delete(id: string): Promise<void> {
    const index = this.residents.findIndex((r) => r.id === id);
    if (index >= 0) {
      this.residents.splice(index, 1);
    }
    return Promise.resolve();
  }
}
