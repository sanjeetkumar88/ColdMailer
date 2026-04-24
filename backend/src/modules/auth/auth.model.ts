import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { Role } from "../../shared/enums/role.enum";
import { IUser } from "./auth.types";

export interface IUserDocument extends Omit<IUser, "_id" | "createdAt" | "updatedAt"> {
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        googleId: {
            type: String,
            sparse: true,
            unique: true,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.MEMBER,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
})

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUserDocument> = mongoose.model('User', userSchema);
