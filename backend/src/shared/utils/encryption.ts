import crypto from 'crypto';

// The key length is dependent on the algorithm. 
// In this case for aes256, it is 32 bytes (256 bits).
// We use a fallback key for development if one is not provided in env.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_needs_32_bytes!'; 
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    content: encrypted,
    authTag: authTag.toString('hex')
  };
};

export const decrypt = (hash: { iv: string; content: string; authTag: string }) => {
  const decipher = crypto.createDecipheriv(
    ALGORITHM, 
    Buffer.from(ENCRYPTION_KEY), 
    Buffer.from(hash.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(hash.authTag, 'hex'));
  
  let decrypted = decipher.update(hash.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
