// lib/db.ts —— server-only 資料存取層。全站唯一的資料入口，改由 Prisma / Postgres backing。
// 對外簽名與回傳型別（Tutor/PublicTutor）保持不變，只是原本同步的查詢改成 async（呼叫端 await）。
// getTutors() 公開查詢只回 published:true。hiddenScore 只留在 server；toPublic 一定剝掉。
import 'server-only';
import { prisma } from './prisma';
import type { Tutor, Review, Endorsement, PublicTutor, Level } from './types';

// TutorProfile 只選這些欄位對映成 Tutor。Json 欄位在 Prisma 是 JsonValue，這裡 as 回 lib/types 結構。
const PROFILE_SELECT = {
  seq: true,
  slug: true,
  name: true,
  nameEn: true,
  title: true,
  avatar: true,
  bio: true,
  hourlyRate: true,
  domains: true,
  skills: true,
  teachLevels: true,
  acceptsProjects: true,
  isReal: true,
  hiddenScore: true,
  aiProfile: true,
  github: true,
  portfolio: true,
  plans: true,
} as const;

type ProfileRow = {
  seq: number;
  slug: string;
  name: string;
  nameEn: string;
  title: string;
  avatar: string;
  bio: string;
  hourlyRate: number;
  domains: string[];
  skills: string[];
  teachLevels: string[];
  acceptsProjects: boolean;
  isReal: boolean;
  hiddenScore: number;
  aiProfile: unknown;
  github: unknown;
  portfolio: unknown;
  plans: unknown;
};

function rowToTutor(r: ProfileRow): Tutor {
  return {
    id: r.seq, // 數字對外 id（frozen 型別要 number），對映 TutorProfile.seq
    slug: r.slug,
    name: r.name,
    nameEn: r.nameEn,
    title: r.title,
    avatar: r.avatar,
    bio: r.bio,
    hourlyRate: r.hourlyRate,
    domains: r.domains,
    skills: r.skills,
    teachLevels: r.teachLevels as Level[],
    acceptsProjects: r.acceptsProjects,
    isReal: r.isReal,
    hiddenScore: r.hiddenScore,
    aiProfile: r.aiProfile as Tutor['aiProfile'],
    github: r.github as Tutor['github'],
    portfolio: r.portfolio as Tutor['portfolio'],
    plans: r.plans as Tutor['plans'],
  };
}

// ---- 公開 API（簽名與舊版一致，回傳改 Promise）----

export async function getTutors(): Promise<Tutor[]> {
  const rows = await prisma.tutorProfile.findMany({
    where: { published: true },
    orderBy: { seq: 'asc' },
    select: PROFILE_SELECT,
  });
  return rows.map((r) => rowToTutor(r as ProfileRow));
}

export async function getTutorBySlug(slug: string): Promise<Tutor | null> {
  const r = await prisma.tutorProfile.findUnique({ where: { slug }, select: PROFILE_SELECT });
  return r ? rowToTutor(r as ProfileRow) : null;
}

// tutorId ＝ TutorProfile.seq（對外數字 id）。Review/Endorsement 型別的 id 對外只當 key，用序號補足。
export async function getReviews(tutorId: number): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { tutorProfile: { seq: tutorId } },
    orderBy: { id: 'asc' },
    select: { author: true, rating: true, text: true },
  });
  return rows.map((r, i) => ({ id: i + 1, tutorId, author: r.author, rating: r.rating, text: r.text }));
}

export async function getEndorsements(tutorId: number): Promise<Endorsement[]> {
  const rows = await prisma.endorsement.findMany({
    where: { tutorProfile: { seq: tutorId } },
    orderBy: { id: 'asc' },
    select: { endorserName: true, endorserTitle: true, quote: true },
  });
  return rows.map((e, i) => ({
    id: i + 1,
    tutorId,
    endorserName: e.endorserName,
    endorserTitle: e.endorserTitle,
    quote: e.quote,
  }));
}

// 傳給 client 前必經：剝除 hiddenScore。hiddenScore 只准留在 server 端（AI prompt 用）。
export function toPublic(t: Tutor): PublicTutor {
  const { hiddenScore: _drop, ...pub } = t;
  void _drop;
  return pub;
}
