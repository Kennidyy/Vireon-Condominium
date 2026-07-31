import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { GetResidentByIdUseCase } from './GetResidentByIdUseCase';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Resident } from '../../domain/entities/Resident';
import { ImageType } from '../../domain/enum/ImageType';

describe('GetResidentByIdUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: GetResidentByIdUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new GetResidentByIdUseCase(repository);
  });

  it('should return the resident when found', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const resident = Resident.create(
      Uuid.create(id),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    const result = await useCase.execute(id);

    expect(result.id).toBe(id);
    expect(result.name).toBe('João Silva');
  });

  it('should throw when resident is not found', async () => {
    await expect(
      useCase.execute('550e8400-e29b-41d4-a716-446655440000'),
    ).rejects.toThrow(ResidentNotFoundException);
  });
});
