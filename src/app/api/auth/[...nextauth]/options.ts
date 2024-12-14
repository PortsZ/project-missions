// Import necessary modules and libraries
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
const bcrypt = require("bcrypt");

export const options: NextAuthOptions = {
  // Configure the authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.identifier || !credentials.password) {
          return null;
        }

        let user;
        let role;

        // Attempt to find the user as a ChurchAdmin
        user = await prisma.churchAdmin.findUnique({
          where: {
            email: credentials.identifier,
          },
        });
        if (user) role = "admin";
        // If not found, attempt to find the user as a Missionary
        if (!user) {
          user = await prisma.missionary.findUnique({
            where: {
              email: credentials.identifier,
            },
          });
          if (user) role = "missionary";
        }

        // Check password and return user with role if correct
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {...user, role}; // Append role information to the user object
        }

        // If no user is found or password does not match, throw an error
        throw new Error("Invalid email or password");
      },
    }),
  ],

  // Configure callbacks for JWT and session handling
  callbacks: {
    // Customize the JWT token to include the user role
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; 
      }
      return token;
    },

    // Customize the session object to include the user role
    async session({ session, token }) {

      session.user.role = token.role;
      

      return session;
    },
  },

  // Configure authentication pages
  // pages: {
  //   signIn: '/auth/signin', // Custom sign-in page
  //   signOut: '/auth/signout', // Custom sign-out page
  //   error: '/auth/error', // Custom error page
  // },

  // Additional NextAuth configuration as needed
};
