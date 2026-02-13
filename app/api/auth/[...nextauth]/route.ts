import { PrismaAdapter } from "@auth/prisma-adapter";

import NextAuth from "next-auth";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";


const handler = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!credentials?.password) {
          return null;
        }

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        return valid ? user : null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token }) {
      return token;
    },

    async session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
