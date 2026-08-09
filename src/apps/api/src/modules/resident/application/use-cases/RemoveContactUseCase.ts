import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRepository';
import { RemoveContactCommand } from '../command/RemoveContactCommand';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';
import { ResidentAccessPolicy } from '../policies/ResidentAccessPolicy';

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

    ResidentAccessPolicy.assertCanMutate(
      resident.id,
      command.authenticatedUserId,
      command.authenticatedRole,
    );

    resident.removeContact(command.contactId);

    await this.residentRepository.update(resident);

    return resident;
  }
}
