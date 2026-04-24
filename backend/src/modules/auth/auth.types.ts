import { Role } from "../../shared/enums/role.enum";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    password?: string;
    googleId?: string;
    role: Role;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface TokenPayload {
    userId: string;
    role: Role;
    email: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}