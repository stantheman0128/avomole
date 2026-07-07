// lib/auth.ts —— Auth.js（NextAuth v5）設定。
// providers：Credentials（email + 密碼 bcrypt 驗證）＋ Google OAuth（未設 key 時自動略過，讓 Credentials 先能動）。
// adapter：Prisma（Google 使用者寫進 User/Account）。session strategy：jwt（因為有 Credentials）。
// role 帶進 jwt/session：守衛與 UI 判斷用。
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

type Role = 'STUDENT' | 'TUTOR';

// 讓 session.user 帶 id / role（TS 型別擴充）
declare module 'next-auth' {
  interface Session {
    user: { id: string; role: Role } & DefaultSession['user'];
  }
  interface User {
    role?: Role;
  }
}
declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
    role?: Role;
  }
}

const googleEnabled = Boolean(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET);

const providers = [
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      const email = typeof credentials?.email === 'string' ? credentials.email.trim().toLowerCase() : '';
      const password = typeof credentials?.password === 'string' ? credentials.password : '';
      if (!email || !password) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return null;

      return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role };
    },
  }),
  ...(googleEnabled
    ? [Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET })]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: { signIn: '/login' },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      // 登入當下 user 有值：把 id/role 寫進 token
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role;
      }
      // OAuth 首次登入可能沒帶 role（adapter 建帳號用預設 STUDENT）：從 DB 補
      if (token.id && !token.role) {
        const db = await prisma.user.findUnique({ where: { id: String(token.id) }, select: { role: true } });
        if (db) token.role = db.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? '');
        session.user.role = (token.role as Role) ?? 'STUDENT';
      }
      return session;
    },
  },
});
