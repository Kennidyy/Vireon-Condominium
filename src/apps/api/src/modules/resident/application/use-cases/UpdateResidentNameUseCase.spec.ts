import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { UpdateResidentUseCase } from './UpdateResidentNameUseCase';
import { UpdateResidentCommand } from '../command/UpdateResidentNameCommand';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';
import { PersonNameIsRequiredException } from '../../domain/exceptions/value-objects/person-name/PersonNameIsRequiredException';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Resident } from '../../domain/entities/Resident';
import { ImageType } from '../../domain/enum/ImageType';

describe('UpdateResidentUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: UpdateResidentUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new UpdateResidentUseCase(repository);
  });

  it('should update the resident name', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await useCase.execute(new UpdateResidentCommand(resident.id, 'Novo Nome'));

    const updated = await repository.getById(resident.id);
    expect(updated?.name).toBe('Novo Nome');
  });

  it('should throw when resident is not found', async () => {
    await expect(
      useCase.execute(
        new UpdateResidentCommand(
          '550e8400-e29b-41d4-a716-446655440000',
          'Novo Nome',
        ),
      ),
    ).rejects.toThrow(ResidentNotFoundException);
  });

  it('should throw on invalid name', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await expect(
      useCase.execute(new UpdateResidentCommand(resident.id, '')),
    ).rejects.toThrow(PersonNameIsRequiredException);
  });
});
