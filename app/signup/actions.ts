'use server';
// app/signup/actions.ts —— 註冊 server action。建 User（含 role）→ 自動登入 → 依角色導向。
// 講師 → /dashboard；學生 → /discover。email 重複、密碼太短等錯誤回可讀狀態。
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/lib/auth';

export type SignupError = 'duplicate' | 'password' | 'email' | 'name' | 'generic';
export type SignupState = { error?: SignupError } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const roleRaw = String(formData.get('role') ?? 'STUDENT');
  const role = roleRaw === 'TUTOR' ? 'TUTOR' : 'STUDENT';

  if (!name) return { error: 'name' };
  if (!EMAIL_RE.test(email)) return { error: 'email' };
  if (password.length < 8) return { error: 'password' };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'duplicate' };

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, role, passwordHash } });
  } catch {
    return { error: 'generic' };
  }

  // 註冊成功 → 自動登入 → 依角色導向（signIn 成功會 throw redirect，往上拋讓 Next 處理）
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: role === 'TUTOR' ? '/dashboard' : '/discover',
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) return { error: 'generic' };
    throw error;
  }
}
