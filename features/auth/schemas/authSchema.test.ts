import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from './authSchema';

describe('Authentication Schemas Unit Tests', () => {

  describe('Login Schema', () => {
    /**
     * Scenario: Invalid email for login
     * Given an email string with wrong format
     * When the loginSchema validates the input
     * Then it should return an "Invalid email" error message
     */
    it('should fail on invalid email format', () => {
      const result = loginSchema.safeParse({ email: 'bad-email', password: '123' });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.email).toContain("Introduce un correo electrónico válido");
      }
    });

    /**
     * Scenario: Empty password for login
     * Given a password that is an empty string
     * When the loginSchema validates the input
     * Then it should return "La contraseña es obligatoria"
     */
    it('should fail when password is empty', () => {
      const result = loginSchema.safeParse({ email: 'test@test.com', password: '' });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.password).toContain("La contraseña es obligatoria");
      }
    });
  });

  describe('Register Schema', () => {
    /**
     * Scenario: Password too short in registration
     * Given a password with less than 6 characters
     * When the registerSchema validates the input
     * Then it should return the minimum length error
     */
    it('should fail if registration password is less than 6 chars', () => {
      const result = registerSchema.safeParse({
        email: 'test@test.com',
        password: '123',
        confirmPassword: '123'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.password).toContain("La contraseña debe tener al menos 6 caracteres");
      }
    });

    /**
     * Scenario: Passwords do not match
     * Given two different password strings
     * When the registerSchema validates the input
     * Then it should return "Las contraseñas no coinciden"
     */
    it('should fail if passwords do not match', () => {
      const result = registerSchema.safeParse({
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'differentPassword'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.confirmPassword).toContain("Las contraseñas no coinciden");
      }
    });

    /**
     * Scenario: Successful registration data
     * Given valid email and matching passwords
     * When the registerSchema validates the input
     * Then it should return success true
     */
    it('should pass if all data is valid and passwords match', () => {
      const result = registerSchema.safeParse({
        email: 'valid@example.com',
        password: 'securePassword123',
        confirmPassword: 'securePassword123'
      });

      expect(result.success).toBe(true);
    });
  });
});