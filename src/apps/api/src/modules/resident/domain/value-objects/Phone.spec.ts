import { Phone } from './Phone';

describe('Phone Value Object', () => {
  describe('Constructor', () => {
    it('should create a valid phone number', () => {
      const phone = Phone.create('+5511999999999');

      expect(phone.value).toBe('+5511999999999');
    });

    it('should trim leading and trailing spaces', () => {
      const phone = Phone.create('  +5511999999999  ');

      expect(phone.value).toBe('+5511999999999');
    });

    it('should throw when phone is empty', () => {
      expect(() => Phone.create('')).toThrow('Phone number is required');
    });

    it('should throw when phone contains only whitespace', () => {
      expect(() => Phone.create('     ')).toThrow('Phone number is required');
    });

    it('should throw when missing country code', () => {
      expect(() => Phone.create('11999999999')).toThrow('Invalid phone format');
    });

    it('should throw when using non-Brazilian country code', () => {
      expect(() => Phone.create('+14155552671')).toThrow(
        'Invalid phone format',
      );
    });

    it('should throw when missing 9 digit prefix', () => {
      expect(() => Phone.create('+551199856958')).toThrow(
        'Invalid phone format',
      );
    });

    it('should throw when phone has too few digits', () => {
      expect(() => Phone.create('+55119998569')).toThrow(
        'Invalid phone format',
      );
    });

    it('should throw when phone has too many digits', () => {
      expect(() => Phone.create('+551199999999900')).toThrow(
        'Invalid phone format',
      );
    });
  });

  describe('equals', () => {
    it('should return true for identical phone numbers', () => {
      const first = Phone.create('+5511999999999');
      const second = Phone.create('+5511999999999');

      expect(first.equals(second)).toBe(true);
    });

    it('should ignore surrounding whitespace', () => {
      const first = Phone.create('  +5511999999999  ');
      const second = Phone.create('+5511999999999');

      expect(first.equals(second)).toBe(true);
    });

    it('should return false for different phone numbers', () => {
      const first = Phone.create('+5511999999999');
      const second = Phone.create('+5521988887777');

      expect(first.equals(second)).toBe(false);
    });
  });
});
