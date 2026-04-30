import crypto from 'crypto';
import { env } from '../../config/env';

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.scryptSync(env.ENCRYPTION_KEY, 'salt', 32);

export const encrypt = (text: string): string => {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = (text: string): string => {
  if (!text || !text.includes(':')) return text;
  const [ivHex, encryptedText] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
