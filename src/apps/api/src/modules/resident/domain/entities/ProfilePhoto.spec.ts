import { ProfilePhoto } from './ProfilePhoto';
import { ImageType } from '../enum/ImageType';
import { ImageExceedsMaxSizeException } from '../exceptions/entities/profile-photo/ImageExceedsMaxSizeException';
import { InvalidImageTypeException } from '../exceptions/entities/profile-photo/InvalidImageTypeException';
import { StorageKeyIsRequiredException } from '../exceptions/entities/profile-photo/StorageKeyIsRequiredException';
import { InvalidUuidException } from '../exceptions/value-objects/uuid/InvalidUuidException';

describe('ProfilePhoto Entity', () => {
  describe('create', () => {
    it('should create a valid profile photo with PNG', () => {
      const photo = ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024);

      expect(photo).toBeInstanceOf(ProfilePhoto);
      expect(photo.storageKey).toBe('photos/abc.png');
      expect(photo.contentType).toBe(ImageType.PNG);
      expect(photo.size).toBe(1024);
    });

    it('should create a valid profile photo with JPEG', () => {
      const photo = ProfilePhoto.create('photos/abc.jpg', ImageType.JPEG, 2048);

      expect(photo.contentType).toBe(ImageType.JPEG);
    });

    it('should assign a unique id', () => {
      const photo = ProfilePhoto.create('photos/abc.png', ImageType.PNG, 100);

      expect(photo.id).toBeDefined();
      expect(typeof photo.id).toBe('string');
      expect(photo.id.length).toBeGreaterThan(0);
    });

    it('should reject invalid image type', () => {
      expect(() =>
        ProfilePhoto.create('photos/abc.gif', 'image/gif' as ImageType, 100),
      ).toThrow(InvalidImageTypeException);
    });

    it('should reject size exceeding max size', () => {
      const max = 5 * 1024 * 1024;

      expect(() =>
        ProfilePhoto.create('photos/abc.png', ImageType.PNG, max + 1),
      ).toThrow(ImageExceedsMaxSizeException);
    });

    it('should accept size exactly at max size', () => {
      const max = 5 * 1024 * 1024;
      const photo = ProfilePhoto.create('photos/abc.png', ImageType.PNG, max);

      expect(photo.size).toBe(max);
    });

    it('should reject empty storage key', () => {
      expect(() => ProfilePhoto.create('', ImageType.PNG, 100)).toThrow(
        StorageKeyIsRequiredException,
      );
    });
  });

  describe('restore', () => {
    it('should restore a profile photo from persistence data', () => {
      const photo = ProfilePhoto.restore(
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        'photos/abc.png',
        ImageType.PNG,
        1024,
      );

      expect(photo.id).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
      expect(photo.storageKey).toBe('photos/abc.png');
      expect(photo.contentType).toBe(ImageType.PNG);
      expect(photo.size).toBe(1024);
    });

    it('should throw when restoring with an invalid id', () => {
      expect(() =>
        ProfilePhoto.restore(
          'invalid-id',
          'photos/abc.png',
          ImageType.PNG,
          100,
        ),
      ).toThrow(InvalidUuidException);
    });
  });

  describe('default', () => {
    it('should create the default profile photo', () => {
      const photo = ProfilePhoto.default();

      expect(photo.storageKey).toBe('defaults/profile.jpg');
      expect(photo.contentType).toBe(ImageType.JPEG);
      expect(photo.size).toBe(124000);
    });
  });

  describe('getters', () => {
    it('should expose id, storageKey, contentType and size', () => {
      const photo = ProfilePhoto.create('photos/abc.png', ImageType.PNG, 300);

      expect(photo.id).toBeDefined();
      expect(typeof photo.id).toBe('string');
      expect(photo.storageKey).toBe('photos/abc.png');
      expect(photo.contentType).toBe(ImageType.PNG);
      expect(photo.size).toBe(300);
    });
  });
});
