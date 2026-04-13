import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    return null;
  }
};

export const comparePasswords = async (plain: string, hashed: string) => {
  return await bcrypt.compare(plain, hashed);
};
