import { ResidentId } from './ResidentId';

describe('ResidentId Value Object', () => {
  describe('generate', () => {
    it('should generate a valid UUID v4', () => {
      const id = ResidentId.generate();

      expect(id.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate unique ids on each call', () => {
      const id1 = ResidentId.generate();
      const id2 = ResidentId.generate();

      expect(id1.value).not.toBe(id2.value);
    });
  });

  describe('Constructor', () => {
    it('should create a valid ResidentId from a UUID v4', () => {
      const id = ResidentId.create('550e8400-e29b-41d4-a716-446655440000');

      expect(id.value).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should throw when value is empty', () => {
      expect(() => ResidentId.create('')).toThrow('Invalid ResidentId');
    });

    it('should throw when value is not a valid UUID', () => {
      expect(() => ResidentId.create('not-a-uuid')).toThrow(
        'Invalid ResidentId',
      );
    });

    it('should throw when value has invalid version', () => {
      expect(() => ResidentId.create('550e8400-e29b-61d4-a716-446655440000')).toThrow(
        'Invalid ResidentId',
      );
    });

    it('should throw when value has invalid variant', () => {
      expect(() => ResidentId.create('550e8400-e29b-41d4-0716-446655440000')).toThrow(
        'Invalid ResidentId',
      );
    });
  });

  describe('equals', () => {
    it('should return true for identical values', () => {
      const id1 = ResidentId.create('550e8400-e29b-41d4-a716-446655440000');
      const id2 = ResidentId.create('550e8400-e29b-41d4-a716-446655440000');

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different values', () => {
      const id1 = ResidentId.create('550e8400-e29b-41d4-a716-446655440000');
      const id2 = ResidentId.create('660e8400-e29b-41d4-a716-446655440000');

      expect(id1.equals(id2)).toBe(false);
    });
  });
});
