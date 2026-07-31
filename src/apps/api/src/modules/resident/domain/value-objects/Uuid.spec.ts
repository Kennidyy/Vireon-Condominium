import { InvalidUuidException } from '../exceptions/value-objects/uuid/InvalidUuidException';
import { Uuid } from './Uuid';

describe('Uuid Value Object', () => {
  const validUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  describe('generate', () => {
    it('should generate a valid uuid', () => {
      const uuid = Uuid.generate();

      expect(uuid).toBeInstanceOf(Uuid);
      expect(typeof uuid.value).toBe('string');
      expect(uuid.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate distinct values on each call', () => {
      const first = Uuid.generate();
      const second = Uuid.generate();

      expect(first.value).not.toBe(second.value);
    });
  });

  describe('create', () => {
    it('should create a uuid from a valid value', () => {
      const uuid = Uuid.create(validUuid);

      expect(uuid.value).toBe(validUuid);
    });

    it('should accept uppercase hex characters', () => {
      const uppercase = 'F47AC10B-58CC-4372-A567-0E02B2C3D479';

      expect(Uuid.create(uppercase).value).toBe(uppercase);
    });

    it('should accept any version between 1 and 5', () => {
      const versions = ['1', '2', '3', '4', '5'];

      versions.forEach((version) => {
        const uuid = `f47ac10b-58cc-4${version}72-a567-0e02b2c3d479`;

        expect(() => Uuid.create(uuid)).not.toThrow();
      });
    });

    it('should reject uuid without hyphens', () => {
      expect(() => Uuid.create('f47ac10b58cc4372a5670e02b2c3d479')).toThrow(
        InvalidUuidException,
      );
    });

    it('should reject uuid with invalid version', () => {
      expect(() => Uuid.create('f47ac10b-58cc-6372-a567-0e02b2c3d479')).toThrow(
        InvalidUuidException,
      );
    });

    it('should reject uuid with invalid variant', () => {
      expect(() => Uuid.create('f47ac10b-58cc-4372-c567-0e02b2c3d479')).toThrow(
        InvalidUuidException,
      );
    });

    it('should reject uuid with invalid hex characters', () => {
      expect(() => Uuid.create('f47ac10b-58cc-4372-a567-0e02b2c3d47z')).toThrow(
        InvalidUuidException,
      );
    });

    it('should reject uuid with wrong length', () => {
      expect(() => Uuid.create('f47ac10b-58cc-4372-a567-0e02b2c3d47')).toThrow(
        InvalidUuidException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for identical uuids', () => {
      const first = Uuid.create(validUuid);
      const second = Uuid.create(validUuid);

      expect(first.equals(second)).toBe(true);
    });

    it('should return false for different uuids', () => {
      const first = Uuid.create(validUuid);
      const second = Uuid.generate();

      expect(first.equals(second)).toBe(false);
    });
  });
});
