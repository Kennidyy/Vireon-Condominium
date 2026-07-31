import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRespository';
import { CreateResidentCommand } from '../command/CreateResidentCommand';
import { Resident } from '../../domain/entities/Resident';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Uuid } from '../../domain/value-objects/Uuid';
import { ResidentAlreadyExistsException } from '../exceptions/ResidentAlreadyExistsException';

@Injectable()
export class CreateResidentUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(command: CreateResidentCommand): Promise<Resident> {
    const exists = await this.residentRepository.getById(command.id);

    if (exists) {
      throw new ResidentAlreadyExistsException();
    }

    const resident = Resident.create(
      Uuid.create(command.id),
      PersonName.create(command.name),
      ProfilePhoto.default(),
    );

    await this.residentRepository.save(resident);

    return resident;
  }
}
