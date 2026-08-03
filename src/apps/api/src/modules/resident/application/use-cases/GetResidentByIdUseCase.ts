import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRepository';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';

@Injectable()
export class GetResidentByIdUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(id: string) {
    const resident = await this.residentRepository.getById(id);

    if (!resident) {
      throw new ResidentNotFoundException();
    }

    return resident;
  }
}
