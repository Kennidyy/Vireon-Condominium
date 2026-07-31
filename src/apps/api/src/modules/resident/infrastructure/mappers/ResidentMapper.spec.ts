import { ResidentMapper } from './ResidentMapper';
import { Resident } from '../../domain/entities/Resident';
import { Contact } from '../../domain/entities/Contact';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ImageType } from '../../domain/enum/ImageType';
import { ContactType } from '../../domain/enum/ContactType';

describe('ResidentMapper', () => {
  const residentId = '550e8400-e29b-41d4-a716-446655440000';
  const photoId = '660e8400-e29b-41d4-a716-446655440001';
  const contactId = '660e8400-e29b-41d4-a716-446655440002';

  const makeResident = () =>
    Resident.create(
      Uuid.create(residentId),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
      [Contact.create(ContactType.EMAIL, 'joao@example.com', true)],
    );

  const prismaProfilePhoto = {
    id: photoId,
    residentId,
    storageKey: 'photos/abc.png',
    contentType: 'PNG' as const,
    size: 1024,
  };

  const prismaContact = {
    id: contactId,
    residentId,
    type: 'EMAIL' as const,
    value: 'joao@example.com',
    isPrimary: true,
  };

  describe('toPersistence', () => {
    it('should map domain Resident to persistence format', () => {
      const resident = makeResident();
      const contact = resident.contactList[0];

      const data = ResidentMapper.toPersistence(resident);

      expect(data).toEqual({
        id: residentId,
        name: 'João Silva',
        contacts: {
          create: [
            {
              id: contact.id,
              type: 'EMAIL',
              value: 'joao@example.com',
              isPrimary: true,
            },
          ],
        },
        profilePhoto: {
          create: {
            id: expect.any(String) as string,
            storageKey: 'photos/abc.png',
            contentType: 'PNG',
            size: 1024,
          },
        },
      });
    });

    it('should throw when image content type is unsupported', () => {
      const photo = ProfilePhoto.restore(
        photoId,
        'photos/abc.gif',
        'image/gif' as ImageType,
        1024,
      );
      const resident = Resident.restore(residentId, 'João Silva', photo, []);

      expect(() => ResidentMapper.toPersistence(resident)).toThrow(
        'Unsupported image content type: image/gif',
      );
    });
  });

  describe('toUpdatePersistence', () => {
    it('should map domain Resident to update format', () => {
      const resident = makeResident();
      const contact = resident.contactList[0];

      const data = ResidentMapper.toUpdatePersistence(resident);

      expect(data).toEqual({
        name: 'João Silva',
        contacts: {
          deleteMany: {},
          create: [
            {
              id: contact.id,
              type: 'EMAIL',
              value: 'joao@example.com',
              isPrimary: true,
            },
          ],
        },
        profilePhoto: {
          upsert: {
            create: {
              id: expect.any(String) as string,
              storageKey: 'photos/abc.png',
              contentType: 'PNG',
              size: 1024,
            },
            update: {
              storageKey: 'photos/abc.png',
              contentType: 'PNG',
              size: 1024,
            },
          },
        },
      });
    });
  });

  describe('toDomain', () => {
    it('should map Prisma data to domain Resident', () => {
      const resident = ResidentMapper.toDomain(
        residentId,
        'João Silva',
        prismaProfilePhoto,
        [prismaContact],
      );

      expect(resident).toBeInstanceOf(Resident);
      expect(resident.id).toBe(residentId);
      expect(resident.name).toBe('João Silva');
      expect(resident.profilePhoto.storageKey).toBe('photos/abc.png');
      expect(resident.profilePhoto.contentType).toBe(ImageType.PNG);
      expect(resident.contactList[0].value).toBe('joao@example.com');
      expect(resident.contactList[0].type).toBe(ContactType.EMAIL);
      expect(resident.contactList[0].isPrimary).toBe(true);
    });

    it('should map JPEG content type correctly', () => {
      const resident = ResidentMapper.toDomain(
        residentId,
        'João Silva',
        { ...prismaProfilePhoto, contentType: 'JPEG' },
        [],
      );

      expect(resident.profilePhoto.contentType).toBe(ImageType.JPEG);
    });

    it('should map PHONE contact type correctly', () => {
      const resident = ResidentMapper.toDomain(
        residentId,
        'João Silva',
        prismaProfilePhoto,
        [{ ...prismaContact, type: 'PHONE', value: '+5511999999999' }],
      );

      expect(resident.contactList[0].type).toBe(ContactType.PHONE);
    });
  });

  describe('round-trip', () => {
    it('should preserve data through toPersistence and toDomain', () => {
      const resident = makeResident();
      const persisted = ResidentMapper.toPersistence(resident);
      const photo = persisted.profilePhoto.create;
      const contacts = persisted.contacts.create;

      const domain = ResidentMapper.toDomain(
        persisted.id,
        persisted.name,
        {
          id: photo.id,
          residentId: persisted.id,
          storageKey: photo.storageKey,
          contentType: photo.contentType,
          size: photo.size,
        },
        contacts.map((contact) => ({
          id: contact.id,
          residentId: persisted.id,
          type: contact.type,
          value: contact.value,
          isPrimary: contact.isPrimary,
        })),
      );

      expect(domain.id).toBe(resident.id);
      expect(domain.name).toBe(resident.name);
      expect(domain.profilePhoto.storageKey).toBe(
        resident.profilePhoto.storageKey,
      );
      expect(domain.contactList[0].value).toBe('joao@example.com');
    });
  });
});
