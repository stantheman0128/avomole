'use server';
// app/login/actions.ts —— 登入 server action。用 Credentials provider 驗證，成功導向 /discover。
import { AuthError } from 'next-auth';
import { signIn } from '@/lib/auth';

export type LoginState = { error?: 'invalid' | 'generic' } | undefined;

export async function authenticate(_prev: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/discover',
    });
    return undefined;
  } catch (error) {
    // signIn 成功時會 throw 一個 redirect，要往上拋讓 Next 處理
    if (error instanceof AuthError) {
      return { error: error.type === 'CredentialsSignin' ? 'invalid' : 'generic' };
    }
    throw error;
  }
}

// Google 登入（server action，供表單 formAction 用）
export async function googleSignIn(): Promise<void> {
  await signIn('google', { redirectTo: '/discover' });
}
