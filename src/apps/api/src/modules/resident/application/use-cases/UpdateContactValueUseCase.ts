import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRepository';
import { UpdateContactValueCommand } from '../command/UpdateContactValueCommand';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';
import { ResidentAccessPolicy } from '../policies/ResidentAccessPolicy';

@Injectable()
export class UpdateContactValueUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(command: UpdateContactValueCommand) {
    const resident = await this.residentRepository.getById(command.id);

    if (!resident) {
      throw new ResidentNotFoundException();
    }

    ResidentAccessPolicy.assertCanMutate(
      resident.id,
      command.authenticatedUserId,
      command.authenticatedRole,
    );

    resident.changeContactValue(command.contactId, command.value);

    await this.residentRepository.update(resident);

    return resident;
  }
}
