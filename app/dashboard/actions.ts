'use server';
// app/dashboard/actions.ts —— 講師後臺 server actions（真 CRUD）。
// 全部直接用 prisma 寫入。每個 action 重新驗 auth + 只認 session.user 對應的 TutorProfile（不信任 client 送的 id）。
// hiddenScore 由 server 從雷達平均推導、寫進 DB，永不回傳給 client。
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateTutorAiProfile } from '@/lib/gemini-tutor';
import { fetchGithubProfile, githubSummaryForPrompt } from '@/lib/github';
import { DOMAINS, LEVELS } from './strings';
import { deriveHiddenScore } from './profile';
import type { AiProfile, PlanItem, PortfolioItem, Radar } from './_components/types';
import type { GithubData } from '@/lib/types';

export type ActionState = { ok?: boolean; error?: string } | undefined;
// 生成側寫回傳新 aiProfile 給 client 立即反映（不含 hiddenScore）。
export type AiActionState =
  | { ok: true; aiProfile: AiProfile; fallback: boolean }
  | { ok?: false; error: string }
  | undefined;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));

// 拿當前登入講師的 profile。非講師 / 未登入 / 無 profile 都回 null，呼叫端據此擋。
async function currentTutorProfile() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || session.user.role !== 'TUTOR') return null;
  const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
  return profile;
}

// 罐頭側寫：Gemini 無 key / 失敗時用，讓 UI 不壞。依技能數量給一點差異、不是死板固定值。
function cannedAiProfile(skills: string[], bio: string): AiProfile {
  const depth = clamp(45 + skills.length * 6, 40, 90);
  const has = (kw: string[]) => skills.some((s) => kw.some((k) => s.toLowerCase().includes(k)));
  const radar: Radar = {
    llm: has(['llm', 'gpt', 'gemini', 'prompt', 'rag', 'agent', 'langchain']) ? clamp(depth + 8, 0, 95) : clamp(depth - 10, 0, 95),
    cv: has(['vision', 'cv', 'yolo', 'opencv', 'image', 'detect']) ? clamp(depth + 5, 0, 95) : clamp(depth - 18, 0, 95),
    mlBasics: has(['ml', 'sklearn', 'pytorch', 'tensorflow', 'model', 'train']) ? clamp(depth + 4, 0, 95) : clamp(depth - 6, 0, 95),
    engineering: has(['python', 'docker', 'api', 'cloud', 'ops', 'sql', 'ts', 'react', 'next']) ? clamp(depth + 6, 0, 95) : clamp(depth - 4, 0, 95),
    teaching: clamp(depth - 2, 30, 88),
    influence: clamp(depth - 14, 20, 80),
  };
  const summary = bio.trim()
    ? bio.trim().slice(0, 80)
    : '這位講師擅長把 AI 概念拆成可動手的小步驟，適合想從實作入門的學生。';
  return {
    radar,
    summary,
    difficulty: clamp(2 + Math.floor(skills.length / 3), 1, 5),
    reviewDigest: '學生普遍反映講解清楚、願意花時間，範例貼近真實專案。',
  };
}

// Slice 1（無 profile 就建草稿）由 profile.ts 的 loadOrCreateProfile 在 page.tsx 直接處理，
// 不需要獨立 action（Server Component 可直接 await；建立不需 revalidate）。

// ---- Slice 2：編輯基本資料 ---------------------------------------------------
function parseStringList(formData: FormData, key: string, allowed: readonly string[]): string[] {
  const picked = formData.getAll(key).map(String);
  return allowed.filter((a) => picked.includes(a)); // 只收白名單值，順序固定
}

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await currentTutorProfile();
  if (!profile) return { error: 'forbidden' };

  const title = String(formData.get('title') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const rateRaw = Number(formData.get('hourlyRate'));
  const acceptsProjects = formData.get('acceptsProjects') === 'on' || formData.get('acceptsProjects') === 'true';
  const githubUsername = String(formData.get('githubUsername') ?? '').trim().replace(/^@/, '');
  const domains = parseStringList(formData, 'domains', DOMAINS);
  const teachLevels = parseStringList(formData, 'teachLevels', LEVELS);
  const skills = String(formData.get('skills') ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 30);

  if (!title) return { error: 'title' };
  if (!Number.isFinite(rateRaw) || rateRaw < 0 || rateRaw > 99999) return { error: 'rate' };

  try {
    await prisma.tutorProfile.update({
      where: { id: profile.id },
      data: {
        title,
        bio,
        hourlyRate: Math.round(rateRaw),
        acceptsProjects,
        githubUsername,
        domains,
        skills,
        teachLevels,
      },
    });
  } catch {
    return { error: 'generic' };
  }
  revalidatePath('/dashboard');
  revalidatePath('/tutors');
  return { ok: true };
}

// ---- Slice 3：作品集 + 方案 -------------------------------------------------
function parsePortfolio(raw: string): PortfolioItem[] {
  try {
    const arr = JSON.parse(raw) as unknown[];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((x) => x as Record<string, unknown>)
      .map((x) => ({
        title: String(x.title ?? '').trim(),
        desc: String(x.desc ?? '').trim(),
        link: String(x.link ?? '').trim(),
      }))
      .filter((x) => x.title || x.desc || x.link)
      .slice(0, 20);
  } catch {
    return [];
  }
}

function parsePlans(raw: string): PlanItem[] {
  try {
    const arr = JSON.parse(raw) as unknown[];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((x) => x as Record<string, unknown>)
      .map((x) => ({
        name: String(x.name ?? '').trim(),
        price: clamp(Number(x.price) || 0, 0, 999999),
        desc: String(x.desc ?? '').trim(),
      }))
      .filter((x) => x.name || x.desc)
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function updatePortfolioPlans(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await currentTutorProfile();
  if (!profile) return { error: 'forbidden' };

  const portfolio = parsePortfolio(String(formData.get('portfolio') ?? '[]'));
  const plans = parsePlans(String(formData.get('plans') ?? '[]'));

  try {
    await prisma.tutorProfile.update({
      where: { id: profile.id },
      data: { portfolio, plans },
    });
  } catch {
    return { error: 'generic' };
  }
  revalidatePath('/dashboard');
  revalidatePath('/tutors');
  return { ok: true };
}

// ---- Slice 4：AI 生成側寫卡 -------------------------------------------------
// 讀 profile 現有技能/自傳/GitHub → Gemini；失敗走罐頭。hiddenScore 由 radar 推導寫入，不回傳。
// 有填 githubUsername 時先抓真 GitHub：抓到就存進 github 欄（公開頁顯示真資料）+ 摘要進 prompt；
// 抓不到（帳號不存在／限流／網路錯）就照舊只用自填資料，github 欄維持原樣。
export async function generateAiProfile(): Promise<AiActionState> {
  const profile = await currentTutorProfile();
  if (!profile) return { error: 'forbidden' };

  const username = (profile.githubUsername ?? '').trim();
  let githubData: GithubData | null = null;
  if (username) {
    try {
      githubData = await fetchGithubProfile(username);
    } catch {
      githubData = null; // 保險：fetchGithubProfile 已自吞錯，這裡再兜一層。
    }
  }

  let aiProfile: AiProfile;
  let fallback = false;
  try {
    aiProfile = await generateTutorAiProfile({
      title: profile.title,
      bio: profile.bio,
      skills: profile.skills,
      domains: profile.domains,
      githubUsername: username,
      githubSummary: githubData ? githubSummaryForPrompt(githubData) : undefined,
    });
  } catch {
    aiProfile = cannedAiProfile(profile.skills, profile.bio);
    fallback = true;
  }

  try {
    await prisma.tutorProfile.update({
      where: { id: profile.id },
      data: {
        aiProfile,
        hiddenScore: deriveHiddenScore(aiProfile.radar),
        // 抓到真 GitHub 才覆寫 github 欄；抓不到就不動（不覆蓋既有 seed/手填資料）。
        // cast：GithubData 是 interface，缺隱式 index signature，不符 Prisma InputJsonValue。
        ...(githubData ? { github: githubData as unknown as Prisma.InputJsonValue } : {}),
      },
    });
  } catch {
    return { error: 'generic' };
  }
  revalidatePath('/dashboard');
  revalidatePath('/tutors');
  return { ok: true, aiProfile, fallback };
}

// 手動微調雷達（+ summary/difficulty/reviewDigest 一起存）。hiddenScore 隨新 radar 重新推導。
export async function updateAiProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await currentTutorProfile();
  if (!profile) return { error: 'forbidden' };

  const current = profile.aiProfile as AiProfile;
  const axis = (k: keyof Radar) => clamp(Number(formData.get(`radar_${k}`)) || 0, 0, 100);
  const radar: Radar = {
    llm: axis('llm'),
    cv: axis('cv'),
    mlBasics: axis('mlBasics'),
    engineering: axis('engineering'),
    teaching: axis('teaching'),
    influence: axis('influence'),
  };
  const summary = String(formData.get('summary') ?? current.summary ?? '').trim();
  const reviewDigest = String(formData.get('reviewDigest') ?? current.reviewDigest ?? '').trim();
  const difficulty = clamp(Number(formData.get('difficulty')) || current.difficulty || 3, 1, 5);

  const aiProfile: AiProfile = { ...current, radar, summary, reviewDigest, difficulty };

  try {
    await prisma.tutorProfile.update({
      where: { id: profile.id },
      data: { aiProfile, hiddenScore: deriveHiddenScore(radar) },
    });
  } catch {
    return { error: 'generic' };
  }
  revalidatePath('/dashboard');
  revalidatePath('/tutors');
  return { ok: true };
}

// ---- 補選角色：學生（含 Google 註冊者，預設 STUDENT）在後臺升級成講師 -----------
// 只允許「學生→講師」單向；jwt callback 對非 TUTOR 會重查 DB，升級免重新登入。
// client 收到 ok 後整頁硬導向 /dashboard，重載時 loadOrCreateProfile 會自動建講師草稿。
export async function becomeTutor(_prev: ActionState): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: 'forbidden' };
  if (session.user.role === 'TUTOR') return { ok: true }; // 已是講師，冪等

  try {
    await prisma.user.update({ where: { id: userId }, data: { role: 'TUTOR' } });
  } catch {
    return { error: 'generic' };
  }
  revalidatePath('/dashboard');
  return { ok: true };
}

// ---- Slice 5：發佈開關 ------------------------------------------------------
export async function togglePublish(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await currentTutorProfile();
  if (!profile) return { error: 'forbidden' };

  const next = formData.get('publish') === 'true';

  try {
    await prisma.tutorProfile.update({
      where: { id: profile.id },
      data: { published: next },
    });
  } catch {
    return { error: 'generic' };
  }
  revalidatePath('/dashboard');
  revalidatePath('/tutors');
  return { ok: true };
}
