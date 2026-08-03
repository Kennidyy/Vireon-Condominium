import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { GetByNameUseCase } from './GetByNameUseCase';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Resident } from '../../domain/entities/Resident';
import { ImageType } from '../../domain/enum/ImageType';

describe('GetByNameUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: GetByNameUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new GetByNameUseCase(repository);
  });

  it('should return residents matching the name', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    const residents = await useCase.execute('João');

    expect(residents).toHaveLength(1);
    expect(residents[0].name).toBe('João Silva');
  });

  it('should be case insensitive', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('Maria Souza'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    const residents = await useCase.execute('maria');

    expect(residents).toHaveLength(1);
  });

  it('should throw when no resident matches', async () => {
    await expect(useCase.execute('Inexistente')).rejects.toThrow(
      ResidentNotFoundException,
    );
  });
});
