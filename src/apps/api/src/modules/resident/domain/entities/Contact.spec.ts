import { ContactType } from '../enum/ContactType';
import { EmailIsRequiredException } from '../exceptions/value-objects/email/EmailIsRequiredException';
import { InvalidEmailFormatException } from '../exceptions/value-objects/email/InvalidEmailFormatException';
import { InvalidPhoneException } from '../exceptions/value-objects/phone/InvalidPhoneException';
import { PhoneIsRequiredException } from '../exceptions/value-objects/phone/PhoneIsRequiredException';
import { Contact } from './Contact';

describe('Contact Entity', () => {
  describe('create', () => {
    it('should create a contact with email', () => {
      const contact = Contact.create(ContactType.EMAIL, 'user@example.com');

      expect(contact).toBeInstanceOf(Contact);
      expect(contact.type).toBe(ContactType.EMAIL);
      expect(contact.value).toBe('user@example.com');
    });

    it('should create a contact with phone', () => {
      const contact = Contact.create(ContactType.PHONE, '+5511999999999');

      expect(contact).toBeInstanceOf(Contact);
      expect(contact.type).toBe(ContactType.PHONE);
      expect(contact.value).toBe('+5511999999999');
    });

    it('should assign a unique id', () => {
      const contact = Contact.create(ContactType.EMAIL, 'a@b.com');

      expect(contact.id).toBeDefined();
      expect(typeof contact.id).toBe('string');
      expect(contact.id.length).toBeGreaterThan(0);
    });

    it('should set isPrimary to false by default', () => {
      const contact = Contact.create(ContactType.EMAIL, 'a@b.com');

      expect(contact.isPrimary).toBe(false);
    });

    it('should set isPrimary when specified', () => {
      const contact = Contact.create(ContactType.EMAIL, 'a@b.com', true);

      expect(contact.isPrimary).toBe(true);
    });

    it('should trim whitespace from the value', () => {
      const contact = Contact.create(ContactType.EMAIL, '  user@example.com  ');

      expect(contact.value).toBe('user@example.com');
    });

    it('should reject empty email', () => {
      expect(() => Contact.create(ContactType.EMAIL, '')).toThrow(
        EmailIsRequiredException,
      );
    });

    it('should reject whitespace-only email', () => {
      expect(() => Contact.create(ContactType.EMAIL, '   ')).toThrow(
        EmailIsRequiredException,
      );
    });

    it('should reject invalid email format', () => {
      expect(() => Contact.create(ContactType.EMAIL, 'not-an-email')).toThrow(
        InvalidEmailFormatException,
      );
    });

    it('should reject email without domain', () => {
      expect(() => Contact.create(ContactType.EMAIL, 'user@')).toThrow(
        InvalidEmailFormatException,
      );
    });

    it('should reject email without username', () => {
      expect(() => Contact.create(ContactType.EMAIL, '@domain.com')).toThrow(
        InvalidEmailFormatException,
      );
    });

    it('should reject empty phone', () => {
      expect(() => Contact.create(ContactType.PHONE, '')).toThrow(
        PhoneIsRequiredException,
      );
    });

    it('should reject whitespace-only phone', () => {
      expect(() => Contact.create(ContactType.PHONE, '   ')).toThrow(
        PhoneIsRequiredException,
      );
    });

    it('should reject phone without country code', () => {
      expect(() => Contact.create(ContactType.PHONE, '11999999999')).toThrow(
        InvalidPhoneException,
      );
    });

    it('should reject phone with non-Brazilian country code', () => {
      expect(() => Contact.create(ContactType.PHONE, '+14155552671')).toThrow(
        InvalidPhoneException,
      );
    });

    it('should reject phone without 9 digit prefix', () => {
      expect(() => Contact.create(ContactType.PHONE, '+551199856958')).toThrow(
        InvalidPhoneException,
      );
    });

    it('should reject phone with too few digits', () => {
      expect(() => Contact.create(ContactType.PHONE, '+55119998569')).toThrow(
        InvalidPhoneException,
      );
    });
  });

  describe('restore', () => {
    it('should restore a contact from persistence data', () => {
      const contact = Contact.restore(
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        ContactType.EMAIL,
        'user@example.com',
        true,
      );

      expect(contact.id).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
      expect(contact.type).toBe(ContactType.EMAIL);
      expect(contact.value).toBe('user@example.com');
      expect(contact.isPrimary).toBe(true);
    });
  });

  describe('changeValue', () => {
    it('should change the contact value', () => {
      const contact = Contact.create(ContactType.EMAIL, 'old@email.com');

      contact.changeValue('new@email.com');

      expect(contact.value).toBe('new@email.com');
    });

    it('should trim whitespace on change', () => {
      const contact = Contact.create(ContactType.EMAIL, 'old@email.com');

      contact.changeValue('  new@email.com  ');

      expect(contact.value).toBe('new@email.com');
    });

    it('should reject invalid value on change', () => {
      const contact = Contact.create(ContactType.EMAIL, 'old@email.com');

      expect(() => contact.changeValue('not-an-email')).toThrow(
        InvalidEmailFormatException,
      );
    });

    it('should validate against the current contact type on change', () => {
      const contact = Contact.create(ContactType.PHONE, '+5511999999999');

      expect(() => contact.changeValue('invalid')).toThrow(
        InvalidPhoneException,
      );
    });
  });

  describe('changePrimaryStatus', () => {
    it('should change isPrimary to true', () => {
      const contact = Contact.create(ContactType.EMAIL, 'a@b.com');

      contact.changePrimaryStatus(true);

      expect(contact.isPrimary).toBe(true);
    });

    it('should change isPrimary to false', () => {
      const contact = Contact.create(ContactType.EMAIL, 'a@b.com', true);

      contact.changePrimaryStatus(false);

      expect(contact.isPrimary).toBe(false);
    });
  });
});
