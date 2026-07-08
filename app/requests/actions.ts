'use server';
// app/requests/actions.ts —— 發需求 server action。
// auth-gate：每次重驗 session，未登入直接導 /login（不信任 client 送的身份）。
// 任何登入者都能發（主要學生），userId 一律取自 session、不吃 client 傳的值。
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DOMAINS, LEVELS } from './strings';

export type RequestState = { ok?: boolean; error?: 'title' | 'desc' | 'generic' } | undefined;

const inList = <T extends string>(v: string, list: readonly T[]): T | null =>
  (list as readonly string[]).includes(v) ? (v as T) : null;

export async function createRequest(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const title = String(formData.get('title') ?? '').trim().slice(0, 120);
  const description = String(formData.get('description') ?? '').trim().slice(0, 1500);
  if (!title) return { error: 'title' };
  if (!description) return { error: 'desc' };

  // budget 可選：空字串或非數字 → null。0–99999 之間才收。
  const budgetRaw = Number(formData.get('budget'));
  const budget =
    Number.isFinite(budgetRaw) && budgetRaw > 0 ? Math.min(Math.round(budgetRaw), 99999) : null;

  // level / domain 可選，只收白名單值，其餘（含「不指定」空字串）存 null。
  const level = inList(String(formData.get('level') ?? ''), LEVELS);
  const domain = inList(String(formData.get('domain') ?? ''), DOMAINS);

  try {
    await prisma.studentRequest.create({
      data: { userId: session.user.id, title, description, budget, level, domain },
    });
  } catch {
    return { error: 'generic' };
  }
  revalidatePath('/requests');
  return { ok: true };
}
