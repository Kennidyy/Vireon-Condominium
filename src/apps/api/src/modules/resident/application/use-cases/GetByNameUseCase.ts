import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRepository';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';

@Injectable()
export class GetByNameUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(name: string) {
    const residents = await this.residentRepository.getByName(name);

    if (residents.length === 0) {
      throw new ResidentNotFoundException();
    }

    return residents;
  }
}
