'use server';
// app/login/actions.ts —— 登入 server action。用 Credentials provider 驗證，成功導向 /。
import { AuthError } from 'next-auth';
import { signIn } from '@/lib/auth';

export type LoginState = { error?: 'invalid' | 'generic'; ok?: boolean } | undefined;

// redirect:false —— 不讓 signIn 自己做 RSC 軟導向（那會讓 client session 沒刷新、Nav 卡在「登入」）。
// 成功回 {ok:true}，由 client 做整頁硬導向，重掛後 SessionProvider 帶到新 session。
export async function authenticate(_prev: LoginState, formData: FormData): Promise<LoginState> {
  try {
    const res = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });
    if (res && typeof res === 'object' && 'error' in res && (res as { error?: unknown }).error) {
      return { error: 'invalid' };
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.type === 'CredentialsSignin' ? 'invalid' : 'generic' };
    }
    throw error;
  }
}

// Google 登入（server action，供表單 formAction 用）
export async function googleSignIn(): Promise<void> {
  await signIn('google', { redirectTo: '/' });
}
