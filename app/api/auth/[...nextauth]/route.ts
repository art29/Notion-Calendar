import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NotionProvider from '@/app/server/auth/providers/Notion'
import { prisma } from '@/app/server/db'

export const authOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    linkAccount: ({ owner, ...data }: any) => {
      return prisma.account.create({ data })
    },
  },
  providers: [
    NotionProvider({
      clientId: process.env.NOTION_CLIENT_ID ?? '',
      clientSecret: process.env.NOTION_CLIENT_SECRET ?? '',
      redirectUri: process.env.NOTION_REDIRECT_URI ?? '',
    }),
  ],
  callbacks: {
    // @ts-ignore
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid
      }
      return session
    },
    // @ts-ignore
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
}

// @ts-ignore
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
