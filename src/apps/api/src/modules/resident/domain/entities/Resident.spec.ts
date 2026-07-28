import { PersonName } from '../value-objects/PersonName';
import { ProfilePhoto } from './ProfilePhoto';
import { Contact } from './Contact';
import { ContactType } from '../enum/ContactType';
import { Resident } from './Resident';

describe('Resident Entity', () => {
  const makeName = () => PersonName.create('João Silva');
  const makePhoto = () => ProfilePhoto.create('photos/abc.png', 'PNG', 2);
  const makeContact = (value = '+5511999999901', isPrimary = false) =>
    Contact.create(ContactType.PHONE, value, isPrimary);

  describe('create', () => {
    it('should create a resident', () => {
      const resident = Resident.create(makeName(), makePhoto());

      expect(resident).toBeInstanceOf(Resident);
    });

    it('should assign a unique id', () => {
      const resident = Resident.create(makeName(), makePhoto());

      expect(resident.id).toBeDefined();
      expect(typeof resident.id).toBe('string');
      expect(resident.id.length).toBeGreaterThan(0);
    });

    it('should expose the name value', () => {
      const resident = Resident.create(makeName(), makePhoto());

      expect(resident.name).toBe('João Silva');
    });

    it('should expose the profile photo storage key', () => {
      const resident = Resident.create(makeName(), makePhoto());

      expect(resident.profilePhoto).toBe('photos/abc.png');
    });

    it('should start with an empty contact list', () => {
      const resident = Resident.create(makeName(), makePhoto());

      expect(resident.contactList()).toHaveLength(0);
    });
  });

  describe('addContact', () => {
    it('should add a contact to the list', () => {
      const resident = Resident.create(makeName(), makePhoto());
      const contact = makeContact();

      resident.addContact(contact);

      expect(resident.contactList()).toHaveLength(1);
      expect(resident.contactList()[0].value).toBe('+5511999999901');
    });

    it('should throw when exceeding the maximum of 10 contacts', () => {
      const resident = Resident.create(makeName(), makePhoto());

      for (let i = 0; i < 11; i++) {
        const suffix = String(i + 10).padStart(2, '0');
        const contact = makeContact(`+55119999999${suffix}`, false);
        resident.addContact(contact);
      }

      expect(() =>
        resident.addContact(makeContact('+5511999999930')),
      ).toThrow('Resident cannot have more than 10 contacts');
    });
  });

  describe('changeContact', () => {
    it('should update the old contact value with the new one', () => {
      const resident = Resident.create(makeName(), makePhoto());
      const oldContact = makeContact('+5511999999901');
      const newContact = makeContact('+5511999999902');

      resident.addContact(oldContact);
      resident.changeContact(newContact, oldContact);

      expect(oldContact.value).toBe('+5511999999902');
    });
  });

  describe('removeContact', () => {
    it('should return the index of the contact', () => {
      const resident = Resident.create(makeName(), makePhoto());
      const contact = makeContact();

      resident.addContact(contact);

      const result = resident.removeContact(contact);

      expect(result).toBe(0);
    });

    it('should return -1 when contact is not found', () => {
      const resident = Resident.create(makeName(), makePhoto());
      const contact = makeContact();
      const other = makeContact('+5511999999904');

      resident.addContact(contact);

      const result = resident.removeContact(other);

      expect(result).toBe(-1);
    });
  });

  describe('contactList', () => {
    it('should return mapped contacts with id, value, type and isPrimary', () => {
      const resident = Resident.create(makeName(), makePhoto());
      const contact = makeContact('+5511999999901', true);

      resident.addContact(contact);

      const list = resident.contactList();

      expect(list).toHaveLength(1);
      expect(list[0]).toEqual({
        id: contact.id,
        value: '+5511999999901',
        type: ContactType.PHONE,
        isPrimary: true,
      });
    });
  });
});
