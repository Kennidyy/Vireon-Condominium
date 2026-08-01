import { Inject, Injectable } from '@nestjs/common';
import { UpdateResidentCommand } from '../command/UpdateResidentNameCommand';
import type { ResidentRepository } from '../ports/ResidentRepository';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';

@Injectable()
export class UpdateResidentUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(command: UpdateResidentCommand) {
    const resident = await this.residentRepository.getById(command.id);

    if (!resident) {
      throw new ResidentNotFoundException();
    }

    resident.changeName(command.name);

    await this.residentRepository.update(resident);

    return resident;
  }
}
