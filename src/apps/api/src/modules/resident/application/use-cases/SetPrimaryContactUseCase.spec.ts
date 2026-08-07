import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { SetPrimaryContactUseCase } from './SetPrimaryContactUseCase';
import { SetPrimaryContactCommand } from '../command/SetPrimaryContactCommand';
import { ResidentNotFoundException } from '../exceptions/ResidentNotFoundException';
import { ResidentAccessDeniedException } from '../exceptions/ResidentAccessDeniedException';
import { ContactNotFoundException } from '../../domain/exceptions/entities/resident/ContactNotFoundException';
import { ContactType } from '../../domain/enum/ContactType';
import { Contact } from '../../domain/entities/Contact';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Resident } from '../../domain/entities/Resident';
import { ImageType } from '../../domain/enum/ImageType';
import { UserRole } from '../../domain/enum/UserRole';

describe('SetPrimaryContactUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: SetPrimaryContactUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new SetPrimaryContactUseCase(repository);
  });

  it('should set the contact as primary', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    const first = Contact.create(ContactType.EMAIL, 'first@example.com', true);
    const second = Contact.create(ContactType.EMAIL, 'second@example.com');
    resident.addContact(first);
    resident.addContact(second);
    await repository.save(resident);

    await useCase.execute(
      new SetPrimaryContactCommand(
        resident.id,
        second.id,
        resident.id,
        UserRole.USER,
      ),
    );

    const updated = await repository.getById(resident.id);
    expect(updated?.contactList[0].isPrimary).toBe(false);
    expect(updated?.contactList[1].isPrimary).toBe(true);
  });

  it('should throw when resident is not found', async () => {
    await expect(
      useCase.execute(
        new SetPrimaryContactCommand(
          '550e8400-e29b-41d4-a716-446655440000',
          'contact-id',
          '550e8400-e29b-41d4-a716-446655440000',
          UserRole.USER,
        ),
      ),
    ).rejects.toThrow(ResidentNotFoundException);
  });

  it('should throw when contact is not found', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    await repository.save(resident);

    await expect(
      useCase.execute(
        new SetPrimaryContactCommand(
          resident.id,
          'non-existent-id',
          resident.id,
          UserRole.USER,
        ),
      ),
    ).rejects.toThrow(ContactNotFoundException);
  });

  it('should deny a non-owner from setting primary contact', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    const first = Contact.create(ContactType.EMAIL, 'first@example.com', true);
    const second = Contact.create(ContactType.EMAIL, 'second@example.com');
    resident.addContact(first);
    resident.addContact(second);
    await repository.save(resident);

    await expect(
      useCase.execute(
        new SetPrimaryContactCommand(
          resident.id,
          second.id,
          '550e8400-e29b-41d4-a716-446655440000',
          UserRole.USER,
        ),
      ),
    ).rejects.toThrow(ResidentAccessDeniedException);
  });
});
