import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateCredentials } from "@/lib/models/User";

// Log the environment variables to debug
console.log('==== NextAuth Environment Variables ====');
console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'not defined'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not defined'}`);

// Log Google credentials (partially masked)
if (process.env.GOOGLE_CLIENT_ID) {
  const idStart = process.env.GOOGLE_CLIENT_ID.substring(0, 8);
  const idEnd = process.env.GOOGLE_CLIENT_ID.substring(process.env.GOOGLE_CLIENT_ID.length - 5);
  console.log(`GOOGLE_CLIENT_ID: ${idStart}...${idEnd}`);
} else {
  console.log('GOOGLE_CLIENT_ID: not defined');
}

if (process.env.GOOGLE_CLIENT_SECRET) {
  const secretStart = process.env.GOOGLE_CLIENT_SECRET.substring(0, 5);
  console.log(`GOOGLE_CLIENT_SECRET: ${secretStart}...`);
} else {
  console.log('GOOGLE_CLIENT_SECRET: not defined');
}

// Create NextAuth config
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Use the validated credentials from database
          const user = await validateCredentials(credentials.email, credentials.password);
          
          // If user is found in database, return user
          if (user) {
            return user;
          }
          
          // For backwards compatibility and development testing
          if (credentials.email === "user@example.com" && credentials.password === "password") {
            return {
              id: "1",
              name: "Test User",
              email: "user@example.com",
            };
          }
          
          // Admin user credentials
          if (credentials.email === "admin@gmail.com" && credentials.password === "admin123") {
            return {
              id: "admin-1",
              name: "Admin User",
              email: "admin@gmail.com",
              role: "admin"
            };
          }
          
          // For demo purposes, allow any credentials during development or if ALLOW_DEMO_LOGIN is set
          if (process.env.NODE_ENV === "development" || process.env.ALLOW_DEMO_LOGIN === "true") {
            return {
              id: Math.random().toString(36).substring(2, 9),
              name: credentials.email.split("@")[0],
              email: credentials.email,
            };
          }
          
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", 
    newUser: "/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user successfully signed in, add their details to the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      // Make token info available in the session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

// Initialize NextAuth
const handler = NextAuth(authConfig);

// Export auth helper
export const { auth } = handler;

// Export handlers for API routes
export { handler as GET, handler as POST }; 