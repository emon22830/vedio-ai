import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import bcrypt from "bcryptjs";
import User from "@/models/User"; // <-- FIX: import User model

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // MUST return user object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks:{
    async jwt({token, user}){
        if(user){
            token.id = user.id
        }
        return token
    },
    async session({session, user, token}){
        if(session.user) {
            session.user.id = token.id as string
        }
        return session;
    }
  },
  pages:{
    signIn: "/login",
    error: "/login"
  },
  session:{
    strategy: "jwt",
    maxAge:30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};


