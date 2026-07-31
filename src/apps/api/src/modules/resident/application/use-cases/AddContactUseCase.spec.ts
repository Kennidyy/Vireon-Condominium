import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { AddContactUseCase } from './AddContactUseCase';
import { AddContactCommand } from '../command/AddContactCommand';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';
import { InvalidEmailFormatException } from '../../domain/exceptions/value-objects/email/InvalidEmailFormatException';
import { InvalidPhoneException } from '../../domain/exceptions/value-objects/phone/InvalidPhoneException';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Resident } from '../../domain/entities/Resident';
import { ImageType } from '../../domain/enum/ImageType';

describe('AddContactUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: AddContactUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new AddContactUseCase(repository);
  });

  it('should add an email contact', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await useCase.execute(
      new AddContactCommand(resident.id, 'EMAIL', 'joao@example.com'),
    );

    const updated = await repository.getById(resident.id);
    expect(updated?.contactList).toHaveLength(1);
    expect(updated?.contactList[0].value).toBe('joao@example.com');
  });

  it('should add a phone contact', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await useCase.execute(
      new AddContactCommand(resident.id, 'PHONE', '+5511999999999'),
    );

    const updated = await repository.getById(resident.id);
    expect(updated?.contactList[0].value).toBe('+5511999999999');
  });

  it('should throw when resident is not found', async () => {
    await expect(
      useCase.execute(
        new AddContactCommand(
          '550e8400-e29b-41d4-a716-446655440000',
          'EMAIL',
          'joao@example.com',
        ),
      ),
    ).rejects.toThrow(ResidentNotFoundException);
  });

  it('should throw on invalid email value', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await expect(
      useCase.execute(new AddContactCommand(resident.id, 'EMAIL', 'invalid')),
    ).rejects.toThrow(InvalidEmailFormatException);
  });

  it('should throw on invalid phone value', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await expect(
      useCase.execute(
        new AddContactCommand(resident.id, 'PHONE', '11999999999'),
      ),
    ).rejects.toThrow(InvalidPhoneException);
  });
});
