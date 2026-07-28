import { ProfilePhoto } from './ProfilePhoto';

describe('ProfilePhoto Entity', () => {
  /*describe('create', () => {
    it('should create a valid profile photo', () => {
      const photo = ProfilePhoto.create('photos/abc.png', 'PNG', 2.5);

      expect(photo).toBeInstanceOf(ProfilePhoto);
      expect(photo.storageKey).toBe('photos/abc.png');
      expect(photo.contentType).toBe('PNG');
      expect(photo.size).toBe(2.5);
    });

    it('should assign a unique id', () => {
      const photo = ProfilePhoto.create('photos/abc.png', 'PNG', 1);

      expect(photo.id).toBeDefined();
      expect(typeof photo.id).toBe('string');
      expect(photo.id.length).toBeGreaterThan(0);
    });

    it('should reject non-PNG content type', () => {
      expect(() =>
        ProfilePhoto.create('photos/abc.jpg', 'JPEG', 1),
      ).toThrow('Image must be of type PNG');
    });

    it('should reject size larger than 5.0 MB', () => {
      expect(() =>
        ProfilePhoto.create('photos/abc.png', 'PNG', 5.01),
      ).toThrow('Invalid image Size Max: 5.0Mb');
    });

    it('should reject size of 0', () => {
      expect(() =>
        ProfilePhoto.create('photos/abc.png', 'PNG', 0),
      ).toThrow('Invalid image Size Max: 5.0Mb');
    });

    it('should accept size exactly 5.0', () => {
      const photo = ProfilePhoto.create('photos/abc.png', 'PNG', 5);

      expect(photo.size).toBe(5);
    });

    it('should accept size exactly 0.01', () => {
      const photo = ProfilePhoto.create('photos/abc.png', 'PNG', 0.01);

      expect(photo.size).toBe(0.01);
    });

    it('should reject negative size', () => {
      expect(() =>
        ProfilePhoto.create('photos/abc.png', 'PNG', -1),
      ).toThrow('Invalid image Size Max: 5.0Mb');
    });

    it('should reject empty storage key', () => {
      expect(() => ProfilePhoto.create('', 'PNG', 1)).toThrow(
        'Storage key is mandatory',
      );
    });
  });

  describe('getters', () => {
    it('should expose id, storageKey, contentType and size', () => {
      const photo = ProfilePhoto.create('photos/abc.png', 'PNG', 3);

      expect(photo.id).toBeDefined();
      expect(typeof photo.id).toBe('string');
      expect(photo.storageKey).toBe('photos/abc.png');
      expect(photo.contentType).toBe('PNG');
      expect(photo.size).toBe(3);
    });
  });
*/});
