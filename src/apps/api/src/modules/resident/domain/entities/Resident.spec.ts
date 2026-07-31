import { ContactType } from '../enum/ContactType';
import { ImageType } from '../enum/ImageType';
import { ContactNotFoundException } from '../exceptions/entities/resident/ContactNotFoundException';
import { ResidentMaxContactsExceededException } from '../exceptions/entities/resident/ResidentMaxContactsExceededException';
import { InvalidUuidException } from '../exceptions/value-objects/uuid/InvalidUuidException';
import { PersonNameIsRequiredException } from '../exceptions/value-objects/person-name/PersonNameIsRequiredException';
import { PersonName } from '../value-objects/PersonName';
import { Uuid } from '../value-objects/Uuid';
import { Contact } from './Contact';
import { ProfilePhoto } from './ProfilePhoto';
import { Resident } from './Resident';

describe('Resident Entity', () => {
  const makeUserId = () => Uuid.generate();
  const makeName = () => PersonName.create('João Silva');
  const makePhoto = () =>
    ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024);
  const makeContact = (value = '+5511999999901', isPrimary = false) =>
    Contact.create(ContactType.PHONE, value, isPrimary);

  describe('create', () => {
    it('should create a resident', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());

      expect(resident).toBeInstanceOf(Resident);
    });

    it('should assign the user id as the resident id', () => {
      const userId = makeUserId();
      const resident = Resident.create(userId, makeName(), makePhoto());

      expect(resident.id).toBe(userId.value);
      expect(resident.userId).toBe(userId.value);
    });

    it('should assign the name', () => {
      const resident = Resident.create(
        makeUserId(),
        PersonName.create('Maria Souza'),
        makePhoto(),
      );

      expect(resident.name).toBe('Maria Souza');
    });

    it('should assign the profile photo', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());

      expect(resident.profilePhoto).toEqual({
        id: expect.any(String) as string,
        storageKey: 'photos/abc.png',
        contentType: ImageType.PNG,
        size: 1024,
      });
    });

    it('should start with an empty contact list by default', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());

      expect(resident.contactList).toHaveLength(0);
    });

    it('should accept an initial contact list', () => {
      const contacts = [makeContact()];
      const resident = Resident.create(
        makeUserId(),
        makeName(),
        makePhoto(),
        contacts,
      );

      expect(resident.contactList).toHaveLength(1);
    });

    it('should throw when initial contacts exceed max', () => {
      const contacts = Array.from({ length: 11 }, (_, i) =>
        makeContact(`+55119999999${String(i + 10).padStart(2, '0')}`),
      );

      expect(() =>
        Resident.create(makeUserId(), makeName(), makePhoto(), contacts),
      ).toThrow(ResidentMaxContactsExceededException);
    });
  });

  describe('restore', () => {
    it('should restore a resident from persistence data', () => {
      const id = '660e8400-e29b-41d4-a716-446655440000';
      const photo = makePhoto();
      const contacts = [makeContact()];

      const resident = Resident.restore(id, 'João Silva', photo, contacts);

      expect(resident.id).toBe(id);
      expect(resident.userId).toBe(id);
      expect(resident.name).toBe('João Silva');
      expect(resident.profilePhoto.storageKey).toBe('photos/abc.png');
      expect(resident.contactList).toHaveLength(1);
    });

    it('should throw when restoring with an invalid id', () => {
      expect(() =>
        Resident.restore('invalid-id', 'João Silva', makePhoto(), []),
      ).toThrow(InvalidUuidException);
    });
  });

  describe('changeName', () => {
    it('should change the name', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());

      resident.changeName('Novo Nome');

      expect(resident.name).toBe('Novo Nome');
    });

    it('should throw on invalid name', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());

      expect(() => resident.changeName('')).toThrow(
        PersonNameIsRequiredException,
      );
    });
  });

  describe('changeProfilePhoto', () => {
    it('should change the profile photo', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());
      const newPhoto = ProfilePhoto.create(
        'photos/new.png',
        ImageType.JPEG,
        512,
      );

      resident.changeProfilePhoto(newPhoto);

      expect(resident.profilePhoto.storageKey).toBe('photos/new.png');
      expect(resident.profilePhoto.contentType).toBe(ImageType.JPEG);
      expect(resident.profilePhoto.size).toBe(512);
    });
  });

  describe('addContact', () => {
    it('should add a contact to the list', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());
      const contact = makeContact();

      resident.addContact(contact);

      expect(resident.contactList).toHaveLength(1);
      expect(resident.contactList[0].value).toBe('+5511999999901');
    });

    it('should throw when exceeding the maximum of 10 contacts', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());

      for (let i = 0; i < 10; i++) {
        const suffix = String(i + 10).padStart(2, '0');
        resident.addContact(makeContact(`+55119999999${suffix}`));
      }

      expect(() => resident.addContact(makeContact('+5511999999920'))).toThrow(
        ResidentMaxContactsExceededException,
      );
    });
  });

  describe('changeContactValue', () => {
    it('should update the contact value by id', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());
      const contact = makeContact();

      resident.addContact(contact);
      resident.changeContactValue(contact.id, '+5511999999902');

      expect(contact.value).toBe('+5511999999902');
    });

    it('should throw when contact is not found', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());

      expect(() =>
        resident.changeContactValue('non-existent-id', '+5511999999902'),
      ).toThrow(ContactNotFoundException);
    });
  });

  describe('setPrimaryContact', () => {
    it('should set the contact as primary', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());
      const contact = makeContact('+5511999999901', false);

      resident.addContact(contact);
      resident.setPrimaryContact(contact.id);

      expect(contact.isPrimary).toBe(true);
    });

    it('should unset primary from other contacts', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());
      const contact1 = makeContact('+5511999999901', true);
      const contact2 = makeContact('+5511999999902', false);

      resident.addContact(contact1);
      resident.addContact(contact2);
      resident.setPrimaryContact(contact2.id);

      expect(contact1.isPrimary).toBe(false);
      expect(contact2.isPrimary).toBe(true);
    });

    it('should throw when contact is not found', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());

      expect(() => resident.setPrimaryContact('non-existent-id')).toThrow(
        ContactNotFoundException,
      );
    });
  });

  describe('removeContact', () => {
    it('should remove a contact by id', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());
      const contact = makeContact();

      resident.addContact(contact);
      resident.removeContact(contact.id);

      expect(resident.contactList).toHaveLength(0);
    });

    it('should throw when contact is not found', () => {
      const resident = Resident.create(makeUserId(), makeName(), makePhoto());

      expect(() => resident.removeContact('non-existent-id')).toThrow(
        ContactNotFoundException,
      );
    });
  });
});
