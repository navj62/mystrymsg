import { Resend } from 'resend';

let client: Resend | null = null;

/**
 * Lazily construct the Resend client. Done on first use (not at module load)
 * so the production build doesn't require RESEND_API_KEY to be present — the
 * key is only needed at runtime when an email is actually sent.
 */
export function getResend(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }
    client = new Resend(apiKey);
  }
  return client;
}
