// app/api/auth/[...nextauth]/route.ts —— Auth.js v5 的 Route Handler。
// GET/POST 全交給 lib/auth 匯出的 handlers（登入/登出/callback/session…）。
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
