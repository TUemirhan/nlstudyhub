import validator from 'validator';

export function sanitizeInput(input: string): string {
  return validator.escape(input.trim());
}

export function validateEmail(email: string): boolean {
  return validator.isEmail(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

export function validateName(name: string): boolean {
  return validator.isLength(name, { min: 2, max: 100 }) && 
         validator.matches(name, /^[a-zA-Z0-9\s\-'.]+$/);
}