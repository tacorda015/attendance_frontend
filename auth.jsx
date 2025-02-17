import axios from "axios"
import jwt from "jsonwebtoken"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/log-in`, {
            username: credentials.username,
            password: credentials.password,
          })

          if (response.data && response.data.token) {
            const decodedToken = jwt.decode(response.data.token)
            return {
              id: decodedToken.id,
              first_name: decodedToken.first_name,
              last_name: decodedToken.last_name,
              role_id: decodedToken.role_id,
              exp: decodedToken.exp,
              originalExp: decodedToken.exp, // Store the original expiration
              token: response.data.token,
            }
          }
          throw new Error("Invalid Employee Number or Password.")
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
    jwt: ({ token, user, trigger }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          role_id: user.role_id,
          exp: user.exp,
          originalExp: user.exp,
          token: user.token,
        }
      }

      return {
        ...token,
        exp: token.originalExp,
      }
    },
    session: ({ session, token }) => {
      session.user = {
        id: token.id,
        first_name: token.first_name,
        last_name: token.last_name,
        role_id: token.role_id,
        exp: token.originalExp,
      }
      session.token = token.token
      return session
    },
  },
})

