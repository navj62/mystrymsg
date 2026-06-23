import { describe, it, expect } from 'vitest';
import { signUpSchema, usernameValidation } from '@/schemas/signUpSchema';
import { messageSchema } from '@/schemas/messageSchema';
import { verifySchema } from '@/schemas/verifySchema';

describe('usernameValidation', () => {
  it('accepts a valid alphanumeric/underscore username', () => {
    expect(usernameValidation.safeParse('cool_user1').success).toBe(true);
  });

  it('rejects usernames shorter than 2 characters', () => {
    expect(usernameValidation.safeParse('a').success).toBe(false);
  });

  it('rejects usernames longer than 20 characters', () => {
    expect(usernameValidation.safeParse('a'.repeat(21)).success).toBe(false);
  });

  it('rejects special characters', () => {
    expect(usernameValidation.safeParse('bad user!').success).toBe(false);
  });
});

describe('signUpSchema', () => {
  it('accepts a fully valid signup payload', () => {
    const result = signUpSchema.safeParse({
      username: 'valid_user',
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = signUpSchema.safeParse({
      username: 'valid_user',
      email: 'not-an-email',
      password: 'secret123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = signUpSchema.safeParse({
      username: 'valid_user',
      email: 'user@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('messageSchema', () => {
  it('accepts content within the 10-300 character range', () => {
    expect(messageSchema.safeParse({ content: 'hello there friend' }).success).toBe(true);
  });

  it('rejects content shorter than 10 characters', () => {
    expect(messageSchema.safeParse({ content: 'too short' }).success).toBe(false);
  });

  it('rejects content longer than 300 characters', () => {
    expect(messageSchema.safeParse({ content: 'x'.repeat(301) }).success).toBe(false);
  });
});

describe('verifySchema', () => {
  it('accepts a 6-character code', () => {
    expect(verifySchema.safeParse({ code: '123456' }).success).toBe(true);
  });

  it('rejects a code that is not exactly 6 characters', () => {
    expect(verifySchema.safeParse({ code: '123' }).success).toBe(false);
    expect(verifySchema.safeParse({ code: '1234567' }).success).toBe(false);
  });
});
