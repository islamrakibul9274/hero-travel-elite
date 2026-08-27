import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { memoryStore } from "@/lib/memory-store";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        // 1. Check MongoDB
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ email: normalizedEmail }).select("+password");

          if (dbUser && dbUser.password) {
            const isValid = await bcrypt.compare(credentials.password, dbUser.password);
            if (isValid) {
              return {
                id: dbUser._id.toString(),
                name: dbUser.name,
                email: dbUser.email,
                image: dbUser.avatar || "",
                role: dbUser.role,
                membershipTier: dbUser.membershipTier,
                loyaltyPoints: dbUser.loyaltyPoints,
              };
            }
          }
        } catch (dbErr) {
          console.warn("MongoDB auth lookup fallback");
        }

        // 2. Resilient memory store check
        const memUser = memoryStore.users.find((u) => u.email === normalizedEmail);
        if (memUser && memUser.password) {
          const isValid = await bcrypt.compare(credentials.password, memUser.password);
          if (isValid) {
            return {
              id: memUser.id,
              name: memUser.name,
              email: memUser.email,
              image: memUser.avatar || "",
              role: memUser.role,
              membershipTier: memUser.membershipTier,
              loyaltyPoints: memUser.loyaltyPoints,
            };
          }
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.membershipTier = (user as any).membershipTier || "free";
        token.loyaltyPoints = (user as any).loyaltyPoints || 100;
      }
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.picture = session.image ?? token.picture;
        if (session.membershipTier) token.membershipTier = session.membershipTier;
        if (session.loyaltyPoints) token.loyaltyPoints = session.loyaltyPoints;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).membershipTier = token.membershipTier as string;
        (session.user as any).loyaltyPoints = token.loyaltyPoints as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

export default authOptions;
