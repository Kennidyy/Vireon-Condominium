import { ProfilePhoto } from './ProfilePhoto';
import { ImageType } from '../enum/ImageType';

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
      ).toThrow('Invalid image type');
    });

    it('should reject size exceeding max size', () => {
      const max = 5 * 1024 * 1024;

      expect(() =>
        ProfilePhoto.create('photos/abc.png', ImageType.PNG, max + 1),
      ).toThrow('Image exceeds max size');
    });

    it('should accept size exactly at max size', () => {
      const max = 5 * 1024 * 1024;
      const photo = ProfilePhoto.create('photos/abc.png', ImageType.PNG, max);

      expect(photo.size).toBe(max);
    });

    it('should reject empty storage key', () => {
      expect(() => ProfilePhoto.create('', ImageType.PNG, 100)).toThrow(
        'Storage key is mandatory',
      );
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
