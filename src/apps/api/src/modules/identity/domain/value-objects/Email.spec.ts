import { Email } from './Email';

describe('Email Value Object', () => {
  describe('Constructor', () => {
    it('should create a valid email', () => {
      const email = Email.create('rafaelredrigues@example.com');

      expect(email.value).toBe('rafaelredrigues@example.com');
    });

    it('should trim leading and trailing spaces', () => {
      const email = Email.create('  batatao@example.com  ');

      expect(email.value).toBe('batatao@example.com');
    });

    it('should normalize the email to lowercase', () => {
      const email = Email.create('NIKOLLAS.ARROBA@Example.COM');

      expect(email.value).toBe('nikollas.arroba@example.com');
    });

    it('should throw when email is empty', () => {
      expect(() => Email.create('')).toThrow('Email is required');
    });

    it('should throw when email contains only whitespace', () => {
      expect(() => Email.create('     ')).toThrow('Invalid Email Format');
    });

    it('should throw when email has no @', () => {
      expect(() => Email.create('fuleco.gmail.com')).toThrow('Invalid Email Format');
    });

    it('should throw when email has no domain', () => {
      expect(() => Email.create('fufuxuxu@')).toThrow('Invalid Email Format');
    });

    it('should throw when email has no username', () => {
      expect(() => Email.create('@nada.com')).toThrow('Invalid Email Format');
    });

    it('should throw when email has no top level domain', () => {
      expect(() => Email.create('exata@mente')).toThrow('Invalid Email Format');
    });
  });

  describe('equals', () => {
    it('should return true for identical emails', () => {
      const first = Email.create('nikollas@vireon.com');
      const second = Email.create('nikollas@vireon.com');

      expect(first.equals(second)).toBe(true);
    });

    it('should ignore case differences', () => {
      const first = Email.create('Alfredo@jest.com');
      const second = Email.create('alfredo@jest.com');

      expect(first.equals(second)).toBe(true);
    });

    it('should ignore surrounding whitespace', () => {
      const first = Email.create(' white@spaces.com ');
      const second = Email.create('white@spaces.com');

      expect(first.equals(second)).toBe(true);
    });

    it('should return false for different emails', () => {
      const first = Email.create('ultimo@teste.com');
      const second = Email.create('gracas@adeus.com');

      expect(first.equals(second)).toBe(false);
    });
  });
});
