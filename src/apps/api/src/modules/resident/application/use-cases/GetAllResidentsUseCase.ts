import { Inject, Injectable } from '@nestjs/common';
import { Resident } from '../../domain/entities/Resident';
import type { ResidentRepository } from '../ports/ResidentRepository';

@Injectable()
export class GetAllResidentsUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(): Promise<Resident[]> {
    return await this.residentRepository.getAll();
  }
}
