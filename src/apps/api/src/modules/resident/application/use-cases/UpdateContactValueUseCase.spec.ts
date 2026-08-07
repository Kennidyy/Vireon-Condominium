import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { UpdateContactValueUseCase } from './UpdateContactValueUseCase';
import { UpdateContactValueCommand } from '../command/UpdateContactValueCommand';
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

describe('UpdateContactValueUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: UpdateContactValueUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new UpdateContactValueUseCase(repository);
  });

  it('should update the contact value', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    const contact = Contact.create(ContactType.EMAIL, 'old@example.com');
    resident.addContact(contact);
    await repository.save(resident);

    await useCase.execute(
      new UpdateContactValueCommand(
        resident.id,
        contact.id,
        'new@example.com',
        resident.id,
        UserRole.USER,
      ),
    );

    const updated = await repository.getById(resident.id);
    expect(updated?.contactList[0].value).toBe('new@example.com');
  });

  it('should throw when resident is not found', async () => {
    await expect(
      useCase.execute(
        new UpdateContactValueCommand(
          '550e8400-e29b-41d4-a716-446655440000',
          'contact-id',
          'new@example.com',
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
        new UpdateContactValueCommand(
          resident.id,
          'non-existent-id',
          'new@example.com',
          resident.id,
          UserRole.USER,
        ),
      ),
    ).rejects.toThrow(ContactNotFoundException);
  });

  it('should deny a non-owner from updating the contact value', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    const contact = Contact.create(ContactType.EMAIL, 'old@example.com');
    resident.addContact(contact);
    await repository.save(resident);

    await expect(
      useCase.execute(
        new UpdateContactValueCommand(
          resident.id,
          contact.id,
          'new@example.com',
          '550e8400-e29b-41d4-a716-446655440000',
          UserRole.USER,
        ),
      ),
    ).rejects.toThrow(ResidentAccessDeniedException);
  });
});
