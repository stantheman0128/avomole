// app/dashboard/profile.ts —— server-only 講師草稿的建立/載入 + 共用預設值 + hiddenScore 推導。
// 不是 'use server'：這裡放純函式與可在 Server Component 直接 await 的 loader（不呼叫 revalidatePath）。
// actions.ts 與 page.tsx 共用，避免 slug/預設邏輯兩份。
import 'server-only';
import { prisma } from '@/lib/prisma';
import type { AiProfile, EditableProfile, Radar } from './_components/types';

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));

export const DEFAULT_RADAR: Radar = {
  llm: 40,
  cv: 30,
  mlBasics: 45,
  engineering: 50,
  teaching: 45,
  influence: 30,
};

// hiddenScore ＝ 雷達六軸平均，clamp 0–100。唯一推導點；使用者不可直接設，永不進 client。
export function deriveHiddenScore(radar: Radar): number {
  const vals = [radar.llm, radar.cv, radar.mlBasics, radar.engineering, radar.teaching, radar.influence];
  return clamp(vals.reduce((a, b) => a + b, 0) / vals.length, 0, 100);
}

export function defaultAiProfile(): AiProfile {
  return { radar: { ...DEFAULT_RADAR }, summary: '', difficulty: 3, reviewDigest: '' };
}

// slug：ASCII-safe（只留 a-z0-9-）。含中文的名字 strip 後可能變空 → 退回 email 帳號 → 'tutor'。
// 不保留漢字：CJK slug 在 URL 上會 404/400（Next 路由與 Prisma 比對對編碼敏感）。
export function baseSlug(name: string | null, email: string | null): string {
  const toAscii = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const fromName = name ? toAscii(name) : '';
  if (fromName.length >= 2) return fromName;
  const fromEmail = email ? toAscii(email.split('@')[0]) : '';
  if (fromEmail.length >= 2) return fromEmail;
  return 'tutor';
}

// 唯一 slug：撞了加 -2、-3…；exceptId 讓自己已佔的 slug 不算撞。極端情況掛時間戳保底。
export async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  let candidate = base;
  let n = 1;
  while (n <= 50) {
    const hit = await prisma.tutorProfile.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!hit || hit.id === exceptId) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

// hiddenScore 絕不出現在這個型別（EditableProfile 本身就 Omit 掉）。
function toEditable(row: {
  slug: string;
  title: string;
  bio: string;
  avatar: string;
  hourlyRate: number;
  acceptsProjects: boolean;
  domains: string[];
  skills: string[];
  teachLevels: string[];
  githubUsername: string | null;
  published: boolean;
  aiProfile: unknown;
  portfolio: unknown;
  plans: unknown;
}): EditableProfile {
  return {
    slug: row.slug,
    title: row.title,
    bio: row.bio,
    avatar: row.avatar,
    hourlyRate: row.hourlyRate,
    acceptsProjects: row.acceptsProjects,
    domains: row.domains,
    skills: row.skills,
    teachLevels: row.teachLevels,
    githubUsername: row.githubUsername ?? '',
    published: row.published,
    aiProfile: row.aiProfile as AiProfile,
    portfolio: (row.portfolio as EditableProfile['portfolio']) ?? [],
    plans: (row.plans as EditableProfile['plans']) ?? [],
  };
}

const EDITABLE_SELECT = {
  slug: true,
  title: true,
  bio: true,
  avatar: true,
  hourlyRate: true,
  acceptsProjects: true,
  domains: true,
  skills: true,
  teachLevels: true,
  githubUsername: true,
  published: true,
  aiProfile: true,
  portfolio: true,
  plans: true,
} as const;

// Slice 1：載入該 user 的講師草稿；沒有就建一個空草稿（unique slug、published:false、預設值）。
// 回傳已剝 hiddenScore 的 EditableProfile，直接給 client 編輯器。
export async function loadOrCreateProfile(
  userId: string,
  name: string | null,
  email: string | null,
): Promise<EditableProfile> {
  const existing = await prisma.tutorProfile.findUnique({ where: { userId }, select: EDITABLE_SELECT });
  if (existing) return toEditable(existing);

  const slug = await uniqueSlug(baseSlug(name, email));
  const radar = { ...DEFAULT_RADAR };
  const fallbackName = (name && name.trim()) || (email ? email.split('@')[0] : '') || '講師';

  try {
    const created = await prisma.tutorProfile.create({
      data: {
        userId,
        slug,
        name: fallbackName,
        nameEn: fallbackName,
        title: '',
        bio: '',
        avatar: '/avatars/t1.svg',
        hourlyRate: 800,
        acceptsProjects: false,
        domains: [],
        skills: [],
        teachLevels: [],
        githubUsername: '',
        isReal: false,
        published: false,
        hiddenScore: deriveHiddenScore(radar),
        aiProfile: defaultAiProfile(),
        github: { username: '', repos: [], langDist: {}, activityNote: '' },
        portfolio: [],
        plans: [],
      },
      select: EDITABLE_SELECT,
    });
    return toEditable(created);
  } catch {
    // 競態：另一請求已建 → 重讀一次。
    const now = await prisma.tutorProfile.findUnique({ where: { userId }, select: EDITABLE_SELECT });
    if (now) return toEditable(now);
    throw new Error('failed to create tutor draft');
  }
}
