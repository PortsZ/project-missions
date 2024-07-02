import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types to include the role property
   */
  interface Session {
    user?: {
      id?: string | number;
      role?: string;
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in user types to include the role property
   */
  interface User {
    role?: string;
  }
}
