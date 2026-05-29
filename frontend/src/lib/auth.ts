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

const BACKEND_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api";

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
          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (data.success && data.data.user) {
            // Get tokens from backend response
            const setCookieHeaders = res.headers.getSetCookie();
            let accessToken = "";
            let refreshToken = "";
            
            if (setCookieHeaders && setCookieHeaders.length > 0) {
              setCookieHeaders.forEach((header) => {
                const [nameValue] = header.split(';');
                const [name, value] = nameValue.split('=');
                if (name === 'accessToken') accessToken = value;
                if (name === 'refreshToken') refreshToken = value;
              });
            }

            return {
              id: data.data.user._id,
              name: data.data.user.name,
              email: data.data.user.email,
              role: data.data.user.role,
              accessToken,
              refreshToken,
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        // For credentials login, the accessToken comes from the user object
        if ((user as any).accessToken) {
          token.accessToken = (user as any).accessToken;
          token.refreshToken = (user as any).refreshToken;
          token.syncedWithBackend = true;
        }
      }
      
      // If logging in via OAuth (Google/Azure), we must call backend to sync
      if (!token.syncedWithBackend && token.email) {
        try {
          const res = await fetch(`${BACKEND_URL}/auth/google-sync`, {
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
            token.syncedWithBackend = true;
            
            // Try to get token from response body first (most reliable)
            if (data.data.accessToken) {
              token.accessToken = data.data.accessToken;
              token.refreshToken = data.data.refreshToken;
            } else {
              // Fallback: parse tokens from Set-Cookie headers
              const setCookieHeader = res.headers.get('set-cookie');
              if (setCookieHeader) {
                const cookies = setCookieHeader.split(',').map(c => c.trim());
                for (const cookie of cookies) {
                  const [nameValue] = cookie.split(';');
                  const eqIndex = nameValue.indexOf('=');
                  if (eqIndex > -1) {
                    const name = nameValue.substring(0, eqIndex).trim();
                    const value = nameValue.substring(eqIndex + 1).trim();
                    if (name === 'accessToken') token.accessToken = value;
                    if (name === 'refreshToken') token.refreshToken = value;
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Backend sync error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
