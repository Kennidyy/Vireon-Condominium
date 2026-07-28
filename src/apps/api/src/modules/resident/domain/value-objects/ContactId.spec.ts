import { ContactId } from './ContactId';

describe('ContactId Value Object', () => {
  describe('generate', () => {
    it('should generate a valid UUID v4', () => {
      const id = ContactId.generate();

      expect(id.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate unique ids on each call', () => {
      const id1 = ContactId.generate();
      const id2 = ContactId.generate();

      expect(id1.value).not.toBe(id2.value);
    });
  });

  describe('Constructor', () => {
    it('should create a valid ContactId from a UUID v4', () => {
      const id = ContactId.create('550e8400-e29b-41d4-a716-446655440000');

      expect(id.value).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should throw when value is empty', () => {
      expect(() => ContactId.create('')).toThrow('Invalid ContactId');
    });

    it('should throw when value is not a valid UUID', () => {
      expect(() => ContactId.create('not-a-uuid')).toThrow('Invalid ContactId');
    });

    it('should throw when value has invalid version', () => {
      expect(() => ContactId.create('550e8400-e29b-61d4-a716-446655440000')).toThrow(
        'Invalid ContactId',
      );
    });

    it('should throw when value has invalid variant', () => {
      expect(() => ContactId.create('550e8400-e29b-41d4-0716-446655440000')).toThrow(
        'Invalid ContactId',
      );
    });
  });

  describe('equals', () => {
    it('should return true for identical values', () => {
      const id1 = ContactId.create('550e8400-e29b-41d4-a716-446655440000');
      const id2 = ContactId.create('550e8400-e29b-41d4-a716-446655440000');

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different values', () => {
      const id1 = ContactId.create('550e8400-e29b-41d4-a716-446655440000');
      const id2 = ContactId.create('660e8400-e29b-41d4-a716-446655440000');

      expect(id1.equals(id2)).toBe(false);
    });
  });
});
