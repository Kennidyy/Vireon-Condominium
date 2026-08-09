import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRepository';
import { SetPrimaryContactCommand } from '../command/SetPrimaryContactCommand';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';
import { ResidentAccessPolicy } from '../policies/ResidentAccessPolicy';

@Injectable()
export class SetPrimaryContactUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(command: SetPrimaryContactCommand) {
    const resident = await this.residentRepository.getById(command.id);

    if (!resident) {
      throw new ResidentNotFoundException();
    }

    ResidentAccessPolicy.assertCanMutate(
      resident.id,
      command.authenticatedUserId,
      command.authenticatedRole,
    );

    resident.setPrimaryContact(command.contactId);

    await this.residentRepository.update(resident);

    return resident;
  }
}
