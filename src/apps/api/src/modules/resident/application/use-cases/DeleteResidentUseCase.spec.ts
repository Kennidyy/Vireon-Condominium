import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { DeleteResidentUseCase } from './DeleteResidentUseCase';
import { DeleteResidentCommand } from '../command/DeleteResidentCommand';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Resident } from '../../domain/entities/Resident';
import { ImageType } from '../../domain/enum/ImageType';

describe('DeleteResidentUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: DeleteResidentUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new DeleteResidentUseCase(repository);
  });

  it('should delete an existing resident', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await useCase.execute(new DeleteResidentCommand(resident.id));

    const remaining = await repository.getById(resident.id);
    expect(remaining).toBeNull();
  });
});
