import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { UpdateProfilePhotoUseCase } from './UpdateProfilePhotoUseCase';
import { UpdateProfilePhotoCommand } from '../command/UpdateProfilePhotoCommand';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';
import { InvalidImageTypeException } from '../../domain/exceptions/entities/profile-photo/InvalidImageTypeException';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Resident } from '../../domain/entities/Resident';
import { ImageType } from '../../domain/enum/ImageType';

describe('UpdateProfilePhotoUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: UpdateProfilePhotoUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new UpdateProfilePhotoUseCase(repository);
  });

  it('should update the profile photo', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await useCase.execute(
      new UpdateProfilePhotoCommand(
        resident.id,
        'photos/new.png',
        ImageType.JPEG,
        512,
      ),
    );

    const updated = await repository.getById(resident.id);
    expect(updated?.profilePhoto.storageKey).toBe('photos/new.png');
    expect(updated?.profilePhoto.contentType).toBe(ImageType.JPEG);
  });

  it('should throw when resident is not found', async () => {
    await expect(
      useCase.execute(
        new UpdateProfilePhotoCommand(
          '550e8400-e29b-41d4-a716-446655440000',
          'photos/new.png',
          ImageType.JPEG,
          512,
        ),
      ),
    ).rejects.toThrow(ResidentNotFoundException);
  });

  it('should throw on invalid image type', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await expect(
      useCase.execute(
        new UpdateProfilePhotoCommand(
          resident.id,
          'photos/new.gif',
          'image/gif',
          512,
        ),
      ),
    ).rejects.toThrow(InvalidImageTypeException);
  });
});
