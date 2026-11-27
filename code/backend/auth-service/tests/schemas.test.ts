import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../src/validation/schemas.js';

describe('registerSchema', () => {
  it('accepts a valid email and a password of 8+ characters', () => {
    const result = registerSchema.safeParse({ email: 'student@example.com', password: 'supersecret1' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email address', () => {
    const result = registerSchema.safeParse({ email: 'not-an-email', password: 'supersecret1' });
    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ email: 'student@example.com', password: 'short' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Password must be at least 8 characters');
  });

  it('rejects a request with missing fields', () => {
    expect(registerSchema.safeParse({}).success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts an email and any non-empty password', () => {
    expect(loginSchema.safeParse({ email: 'student@example.com', password: 'x' }).success).toBe(true);
  });

  it('rejects an empty password', () => {
    expect(loginSchema.safeParse({ email: 'student@example.com', password: '' }).success).toBe(false);
  });
});
