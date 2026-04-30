import { NextAuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import dbConnect from "./db";
import User from "./models/User";
import { comparePasswords } from "./auth-utils";
import clientPromise from "./mongodb-client"; // We need this for the adapter

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise as any) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (data.success && data.data.token) {
            return {
              id: data.data.user._id,
              name: data.data.user.name,
              email: data.data.user.email,
              role: data.data.user.role,
              accessToken: data.data.accessToken, // Store the backend token
              refreshToken: data.data.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        
        const decoded: any = jwt.decode((user as any).accessToken);
        if (decoded) token.accessTokenExpires = decoded.exp * 1000;
      }
      
      // If accessToken is missing (e.g., OAuth login), sync with backend to get our custom tokens
      if (!token.accessToken && token.email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: token.email,
              name: token.name,
            }),
          });
          const data = await res.json();
          if (data.success) {
            token.id = data.data.user._id;
            token.accessToken = data.data.accessToken;
            token.refreshToken = data.data.refreshToken;
            
            // Decode token to get expiration
            const decoded: any = jwt.decode(data.data.accessToken);
            token.accessTokenExpires = decoded.exp * 1000;
          }
        } catch (error) {
          console.error("Backend sync error:", error);
        }
      }

      // Check if token is expired
      const now = Date.now();
      if (token.accessTokenExpires && now > (token.accessTokenExpires as number) - 60 * 1000) {
        // Token is expired or about to expire (1 min buffer), refresh it
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });
          const data = await res.json();
          if (data.success) {
            token.accessToken = data.data.accessToken;
            const decoded: any = jwt.decode(data.data.accessToken);
            token.accessTokenExpires = decoded.exp * 1000;
          }
        } catch (error) {
          console.error("Error refreshing access token:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
        (session as any).error = token.error;
      }
      return session;
    },
  },
};
