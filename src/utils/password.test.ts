import { validatePassword, checkPasswordStrength } from './password';

describe('Password Validation', () => {
  describe('validatePassword', () => {
    it('should return true for valid password', () => {
      const password = 'StrongPassword123!';
<<<<<<< HEAD
      expect(validatePassword(password).isValid).toBe(true);
=======
      expect(validatePassword(password)).toBe(true);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });

    it('should return false for password shorter than 12 characters', () => {
      const password = 'Short123!';
<<<<<<< HEAD
      expect(validatePassword(password).isValid).toBe(false);
=======
      expect(validatePassword(password)).toBe(false);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });

    it('should return false for password without uppercase letter', () => {
      const password = 'lowercase123!';
<<<<<<< HEAD
      expect(validatePassword(password).isValid).toBe(false);
=======
      expect(validatePassword(password)).toBe(false);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });

    it('should return false for password without lowercase letter', () => {
      const password = 'UPPERCASE123!';
<<<<<<< HEAD
      expect(validatePassword(password).isValid).toBe(false);
=======
      expect(validatePassword(password)).toBe(false);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });

    it('should return false for password without number', () => {
      const password = 'NoNumberHere!';
<<<<<<< HEAD
      expect(validatePassword(password).isValid).toBe(false);
=======
      expect(validatePassword(password)).toBe(false);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });

    it('should return false for password without special character', () => {
      const password = 'NoSpecialChar123';
<<<<<<< HEAD
      expect(validatePassword(password).isValid).toBe(false);
=======
      expect(validatePassword(password)).toBe(false);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });
  });

  describe('checkPasswordStrength', () => {
    it('should return "strong" for valid password', () => {
      const password = 'StrongPassword123!';
      expect(checkPasswordStrength(password)).toBe('strong');
    });

    it('should return "medium" for password with some requirements met', () => {
      const password = 'Medium123';
      expect(checkPasswordStrength(password)).toBe('medium');
    });

    it('should return "weak" for password with few requirements met', () => {
      const password = 'weak';
      expect(checkPasswordStrength(password)).toBe('weak');
    });

    it('should return "weak" for empty password', () => {
      const password = '';
      expect(checkPasswordStrength(password)).toBe('weak');
    });

    it('should return "strong" for password with all requirements and extra length', () => {
      const password = 'VeryStrongPassword123!ExtraLong';
      expect(checkPasswordStrength(password)).toBe('strong');
    });

    it('should return "medium" for password with mixed case and numbers but no special chars', () => {
      const password = 'MixedCase123';
      expect(checkPasswordStrength(password)).toBe('medium');
    });

    it('should return "medium" for password with special chars and numbers but no mixed case', () => {
      const password = 'lowercase123!';
      expect(checkPasswordStrength(password)).toBe('medium');
    });
  });
}); 