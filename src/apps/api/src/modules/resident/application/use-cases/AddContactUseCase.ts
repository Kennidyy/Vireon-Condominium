import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRespository';
import { AddContactCommand } from '../command/AddContactCommand';
import { Contact } from '../../domain/entities/Contact';
import { ContactType } from '../../domain/enum/ContactType';

@Injectable()
export class AddContactUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(command: AddContactCommand) {
    const resident = await this.residentRepository.getById(command.id);

    if (!resident) {
      throw new Error('Resident not found');
    }

    const contact = Contact.create(
      ContactType[command.type as keyof typeof ContactType],
      command.value,
    );

    resident.addContact(contact);

    await this.residentRepository.update(resident);

    return resident;
  }
}
