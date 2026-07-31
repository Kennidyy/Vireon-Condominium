import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRespository';
import { UpdateProfilePhotoCommand } from '../command/UpdateProfilePhotoCommand';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { ImageType } from '../../domain/enum/ImageType';

@Injectable()
export class UpdateProfilePhotoUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(command: UpdateProfilePhotoCommand) {
    const resident = await this.residentRepository.getById(command.id);

    if (!resident) {
      throw new Error('Resident not found');
    }

    const photo = ProfilePhoto.create(
      command.storageKey,
      command.contentType as ImageType,
      command.size,
    );

    resident.changeProfilePhoto(photo);

    await this.residentRepository.update(resident);

    return resident;
  }
}
