import jwt from 'jsonwebtoken';
import { User, IUserDocument } from './auth.model';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';

export class AuthService {
  static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  static async register(data: any) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new AppError('Email already in use', 400);

    const user = await User.create(data);
    const token = this.generateToken(user._id.toString());

    return { user, token };
  }

  static async login(data: any) {
    const { email, password } = data;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user._id.toString());
    return { user, token };
  }
}
