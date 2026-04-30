import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUserDocument } from './auth.model';
import { RefreshToken } from './refreshToken.model';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';

export class AuthService {
  static async generateTokens(userId: string) {
    const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: '15m', // Short-lived
    });

    const refreshTokenString = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create({
      token: refreshTokenString,
      userId,
      expiresAt,
    });

    return { accessToken, refreshToken: refreshTokenString };
  }

  static async refreshAccessToken(refreshTokenString: string) {
    const refreshToken = await RefreshToken.findOne({ 
      token: refreshTokenString, 
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });

    if (!refreshToken) throw new AppError('Invalid or expired refresh token', 401);

    const accessToken = jwt.sign({ id: refreshToken.userId }, env.JWT_SECRET, {
      expiresIn: '15m',
    });

    return { accessToken };
  }

  static async register(data: any) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new AppError('Email already in use', 400);

    const user = await User.create(data);
    const tokens = await this.generateTokens(user._id.toString());

    return { user, ...tokens };
  }

  static async login(data: any) {
    const { email, password } = data;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = await this.generateTokens(user._id.toString());
    return { user, ...tokens };
  }

  static async googleSync(data: { email: string, name: string }) {
    let user = await User.findOne({ email: data.email });
    
    if (!user) {
      user = await User.create({
        email: data.email,
        name: data.name,
        // For OAuth users, we don't necessarily need a password, but the model might require it
        password: crypto.randomBytes(16).toString('hex'), 
        role: 'user',
      });
    }

    const tokens = await this.generateTokens(user._id.toString());
    return { user, ...tokens };
  }
}
