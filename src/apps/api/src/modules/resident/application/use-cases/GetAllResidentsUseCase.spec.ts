import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { GetAllResidentsUseCase } from './GetAllResidentsUseCase';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Resident } from '../../domain/entities/Resident';
import { ImageType } from '../../domain/enum/ImageType';

describe('GetAllResidentsUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: GetAllResidentsUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new GetAllResidentsUseCase(repository);
  });

  it('should return an empty list when there are no residents', async () => {
    const residents = await useCase.execute();

    expect(residents).toEqual([]);
  });

  it('should return all residents', async () => {
    const first = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    const second = Resident.create(
      Uuid.generate(),
      PersonName.create('Maria Souza'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(first);
    await repository.save(second);

    const residents = await useCase.execute();

    expect(residents).toHaveLength(2);
  });
});
