import { PersonName } from './PersonName';

describe('PersonName Value Object', () => {
  describe('Constructor', () => {
    it('should create a valid person name', () => {
      const name = PersonName.create('Marcos de Oliveira');

      expect(name.value).toBe('Marcos de Oliveira');
    });

    it('should trim leading and trailing spaces', () => {
      const name = PersonName.create('  Marcos de Oliveira  ');

      expect(name.value).toBe('Marcos de Oliveira');
    });

    it('should normalize multiple spaces inside the name', () => {
      const name = PersonName.create('Marcos    de   Oliveira');

      expect(name.value).toBe('Marcos de Oliveira');
    });

    it('should throw when name is empty', () => {
      expect(() => PersonName.create('')).toThrow('Name is required');
    });

    it('should throw when name contains only whitespace', () => {
      expect(() => PersonName.create('     ')).toThrow('Name is required');
    });

    it('should throw when name contains numbers', () => {
      expect(() => PersonName.create('Elon M0sca')).toThrow(
        'Name cannot contain numbers',
      );
    });

    it('should throw when name is larger than 255 characters', () => {
      expect(() => PersonName.create('a'.repeat(256))).toThrow(
        'Name is too large',
      );
    });
  });

  describe('equals', () => {
    it('should return true for identical names', () => {
      const first = PersonName.create('João Silva');
      const second = PersonName.create('João Silva');

      expect(first.equals(second)).toBe(true);
    });

    it('should ignore surrounding whitespace', () => {
      const first = PersonName.create('  João Silva  ');
      const second = PersonName.create('João Silva');

      expect(first.equals(second)).toBe(true);
    });

    it('should ignore double spaces inside the name', () => {
      const first = PersonName.create('João    Silva');
      const second = PersonName.create('João Silva');

      expect(first.equals(second)).toBe(true);
    });

    it('should return false for different names', () => {
      const first = PersonName.create('João Silva');
      const second = PersonName.create('Maria Souza');

      expect(first.equals(second)).toBe(false);
    });
  });
});
