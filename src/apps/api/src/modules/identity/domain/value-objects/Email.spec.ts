import { Email } from './Email';

describe('Email Value Object', () => {
  describe('Constructor', () => {
    it('should create a valid email', () => {
      const email = new Email('rafaelredrigues@example.com');

      expect(email.value).toBe('rafaelredrigues@example.com');
    });

    it('should trim leading and trailing spaces', () => {
      const email = new Email('  batatao@example.com  ');

      expect(email.value).toBe('batatao@example.com');
    });

    it('should normalize the email to lowercase', () => {
      const email = new Email('NIKOLLAS.ARROBA@Example.COM');

      expect(email.value).toBe('nikollas.arroba@example.com');
    });

    it('should throw when email is empty', () => {
      expect(() => new Email('')).toThrow('Email is required');
    });

    it('should throw when email contains only whitespace', () => {
      expect(() => new Email('     ')).toThrow('Invalid email');
    });

    it('should throw when email has no @', () => {
      expect(() => new Email('fuleco.gmail.com')).toThrow('Invalid email');
    });

    it('should throw when email has no domain', () => {
      expect(() => new Email('fufuxuxu@')).toThrow('Invalid email');
    });

    it('should throw when email has no username', () => {
      expect(() => new Email('@nada.com')).toThrow('Invalid email');
    });

    it('should throw when email has no top level domain', () => {
      expect(() => new Email('exata@mente')).toThrow('Invalid email');
    });
  });

  describe('equals', () => {
    it('should return true for identical emails', () => {
      const first = new Email('nikollas@vireon.com');
      const second = new Email('nikollas@vireon.com');

      expect(first.equals(second)).toBe(true);
    });

    it('should ignore case differences', () => {
      const first = new Email('Alfredo@jest.com');
      const second = new Email('alfredo@jest.com');

      expect(first.equals(second)).toBe(true);
    });

    it('should ignore surrounding whitespace', () => {
      const first = new Email(' white@spaces.com ');
      const second = new Email('white@spaces.com');

      expect(first.equals(second)).toBe(true);
    });

    it('should return false for different emails', () => {
      const first = new Email('ultimo@teste.com');
      const second = new Email('gracas@adeus.com');

      expect(first.equals(second)).toBe(false);
    });
  });
});
