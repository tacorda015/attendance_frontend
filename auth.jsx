import axios from "axios";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Send login request
          const response = await axios.post(
            `https://172.168.10.119:2000/api/log-in`,
            {
              username: credentials.username,
              password: credentials.password,
            }
          );
      
          if (response.data && response.data.token) {
            const decodedToken = jwt.decode(response.data.token);
      
            return {
              id: decodedToken.id,
              first_name: decodedToken.first_name,
              last_name: decodedToken.last_name,
              role_id: decodedToken.role_id,
              emp_no: decodedToken.emp_no,
              token: response.data.token,
            };
          }
      
          // Explicitly throw an error if authentication fails
          throw new Error("Invalid Employee Number or Password.");
        } catch (error) {
          return null
        }
      },      
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.role_id = user.role_id;
        token.emp_no = user.emp_no;
        token.token = user.token;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user = {
        id: token.id,
        first_name: token.first_name,
        last_name: token.last_name,
        role_id: token.role_id,
        emp_no: token.emp_no,
      };
      session.token = token.token;
      return session;
    },
  },
});
