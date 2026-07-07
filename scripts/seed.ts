// scripts/seed.ts —— 把 data/tutors.json 的 9 位講師 upsert 進 Postgres（Prisma）。
// 執行：npm run seed（讀 .env 的 DATABASE_URL）。可重跑：以 slug / seq 為鍵 upsert，不會重複灌。
// 每位講師建：User(role=TUTOR, email=<slug>@demo.guacamole.ai, 固定 demo passwordHash) + TutorProfile(published=true)
// + 其 reviews / endorsements。Stan 那張 isReal=true。
import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import type { TutorData, Tutor } from '../lib/types';

const prisma = new PrismaClient();

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_PATH = path.join(DATA_DIR, 'tutors.json');
const SAMPLE_PATH = path.join(DATA_DIR, 'tutors.sample.json');

// demo 帳號共用密碼（僅供展示；非真使用者）。真註冊走 /signup 自己設密碼。
const DEMO_PASSWORD = 'guacamole-demo';

export function loadData(): TutorData {
  const file = fs.existsSync(JSON_PATH) ? JSON_PATH : SAMPLE_PATH;
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as TutorData;
}

// nameEn 塞進 github JSON 沒必要——name/nameEn 現在是 TutorProfile 的真欄位。
async function upsertTutor(t: Tutor, passwordHash: string): Promise<void> {
  const email = `${t.slug}@demo.guacamole.ai`;

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: t.name, role: 'TUTOR', passwordHash },
    create: { email, name: t.name, role: 'TUTOR', passwordHash },
  });

  const profileData = {
    seq: t.id, // 用 tutors.json 的數字 id 當穩定 seq（對映 Tutor.id）
    name: t.name,
    nameEn: t.nameEn,
    title: t.title,
    titleEn: t.titleEn ?? null,
    bio: t.bio,
    bioEn: t.bioEn ?? null,
    avatar: t.avatar,
    hourlyRate: t.hourlyRate,
    acceptsProjects: t.acceptsProjects,
    domains: t.domains,
    skills: t.skills,
    teachLevels: t.teachLevels,
    githubUsername: t.github?.username ?? null,
    isReal: t.isReal,
    published: true, // 9 位 seed 講師＝預先發佈
    hiddenScore: t.hiddenScore,
    aiProfile: t.aiProfile as unknown as Prisma.InputJsonValue,
    github: t.github as unknown as Prisma.InputJsonValue,
    portfolio: t.portfolio as unknown as Prisma.InputJsonValue,
    plans: t.plans as unknown as Prisma.InputJsonValue,
  };

  await prisma.tutorProfile.upsert({
    where: { slug: t.slug },
    update: { ...profileData, userId: user.id },
    create: { ...profileData, slug: t.slug, userId: user.id },
  });
}

// reviews / endorsements：以 (tutorProfileId) 重灌——先刪該講師既有的再插入，確保可重跑冪等。
async function reseedReviewsAndEndorsements(data: TutorData): Promise<void> {
  const profiles = await prisma.tutorProfile.findMany({ select: { id: true, seq: true } });
  const seqToId = new Map(profiles.map((p) => [p.seq, p.id]));

  for (const p of profiles) {
    await prisma.review.deleteMany({ where: { tutorProfileId: p.id } });
    await prisma.endorsement.deleteMany({ where: { tutorProfileId: p.id } });
  }

  for (const r of data.reviews) {
    const tutorProfileId = seqToId.get(r.tutorId);
    if (!tutorProfileId) continue;
    await prisma.review.create({
      data: { tutorProfileId, author: r.author, rating: r.rating, text: r.text, textEn: r.textEn ?? null },
    });
  }
  for (const e of data.endorsements) {
    const tutorProfileId = seqToId.get(e.tutorId);
    if (!tutorProfileId) continue;
    await prisma.endorsement.create({
      data: {
        tutorProfileId,
        endorserName: e.endorserName,
        endorserTitle: e.endorserTitle,
        quote: e.quote,
      },
    });
  }
}

export async function seed(): Promise<{ tutors: number; reviews: number; endorsements: number }> {
  const data = loadData();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const t of data.tutors) {
    await upsertTutor(t, passwordHash);
  }
  await reseedReviewsAndEndorsements(data);
  // 用顯式 seq(1-9) upsert 不會推進 Postgres autoincrement sequence，之後 create 的講師會拿 seq=1 撞 unique。
  // 把 sequence 推到目前 max，讓新講師從 max+1 開始。
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"TutorProfile"', 'seq'), (SELECT COALESCE(MAX(seq), 1) FROM "TutorProfile"))`,
  );
  return {
    tutors: data.tutors.length,
    reviews: data.reviews.length,
    endorsements: data.endorsements.length,
  };
}

function isMain(): boolean {
  const arg = (process.argv[1] ?? '').replace(/\\/g, '/');
  return arg.endsWith('/seed.ts') || arg.endsWith('/seed.js');
}

if (isMain()) {
  seed()
    .then((n) => {
      console.log(`seeded ${n.tutors} tutors, ${n.reviews} reviews, ${n.endorsements} endorsements -> Postgres`);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
