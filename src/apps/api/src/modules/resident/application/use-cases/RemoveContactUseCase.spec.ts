import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { RemoveContactUseCase } from './RemoveContactUseCase';
import { RemoveContactCommand } from '../command/RemoveContactCommand';
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

describe('RemoveContactUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: RemoveContactUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new RemoveContactUseCase(repository);
  });

  it('should remove the contact', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    const contact = Contact.create(ContactType.EMAIL, 'joao@example.com');
    resident.addContact(contact);
    await repository.save(resident);

    await useCase.execute(
      new RemoveContactCommand(
        resident.id,
        contact.id,
        resident.id,
        UserRole.USER,
      ),
    );

    const updated = await repository.getById(resident.id);
    expect(updated?.contactList).toHaveLength(0);
  });

  it('should throw when resident is not found', async () => {
    await expect(
      useCase.execute(
        new RemoveContactCommand(
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
        new RemoveContactCommand(
          resident.id,
          'non-existent-id',
          resident.id,
          UserRole.USER,
        ),
      ),
    ).rejects.toThrow(ContactNotFoundException);
  });

  it('should deny a non-owner from removing a contact', async () => {
    const resident = Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );
    const contact = Contact.create(ContactType.EMAIL, 'joao@example.com');
    resident.addContact(contact);
    await repository.save(resident);

    await expect(
      useCase.execute(
        new RemoveContactCommand(
          resident.id,
          contact.id,
          '550e8400-e29b-41d4-a716-446655440000',
          UserRole.USER,
        ),
      ),
    ).rejects.toThrow(ResidentAccessDeniedException);
  });
});
