import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRepository';
import { RemoveContactCommand } from '../command/RemoveContactCommand';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';

@Injectable()
export class RemoveContactUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(command: RemoveContactCommand) {
    const resident = await this.residentRepository.getById(command.id);

    if (!resident) {
      throw new ResidentNotFoundException();
    }

    resident.removeContact(command.contactId);

    await this.residentRepository.update(resident);

    return resident;
  }
}
