import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
      GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // DiscordProvider,
    // /**
    //  * ...add more providers here.
    //  *
    //  * Most other providers require a bit more work than the Discord provider. For example, the
    //  * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
    //  * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
    //  *
    //  * @see https://next-auth.js.org/providers/github
    //  */
  ],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(db) as any,
  callbacks: {

     async signIn({ user, account, profile }) {
      // Only allow SMU email addresses
      if (account?.provider === "google") {
        const email = user.email ?? profile?.email;
        if (!email?.endsWith("@smu.edu.sg")) {
          return false; // Reject sign-in
        }
      }
      return true;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
     async redirect({ url, baseUrl }) {
      if (url === '/api/auth/signout' || url.includes('signout')) {
        return baseUrl + '/login';
      }
      return baseUrl + '/user-check';
    },
  },
   pages: {
    signIn: "/login", // custom login page
     error: "/login",

  },
} satisfies NextAuthConfig;
