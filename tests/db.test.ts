import { describe, it, expect } from 'vitest';
import type { Tutor } from '../lib/types';

// toPublic 是純函式，不碰 DB：一定要剝掉 hiddenScore（鐵則，型別 + 執行期雙保險）。
describe('toPublic — 剝除 hiddenScore', () => {
  it('回傳物件不含 hiddenScore', async () => {
    const { toPublic } = await import('../lib/db');
    const fake: Tutor = {
      id: 1,
      slug: 'x',
      name: '測試',
      nameEn: 'Test',
      title: 't',
      avatar: '/a.svg',
      bio: 'b',
      hourlyRate: 100,
      domains: [],
      skills: [],
      teachLevels: [],
      acceptsProjects: false,
      isReal: false,
      hiddenScore: 99,
      aiProfile: {
        radar: { llm: 1, cv: 1, mlBasics: 1, engineering: 1, teaching: 1, influence: 1 },
        summary: '',
        difficulty: 1,
        reviewDigest: '',
      },
      github: { username: 'x', repos: [], langDist: {}, activityNote: '' },
      portfolio: [],
      plans: [],
    };
    const pub = toPublic(fake);
    expect('hiddenScore' in pub).toBe(false);
    expect(pub.slug).toBe('x');
  });
});

// 整合測試：需要真的 DATABASE_URL 且已 seed。沒設 DB 就跳過（CI 無 DB 也不會紅）。
const HAS_DB = Boolean(process.env.DATABASE_URL) && !process.env.DATABASE_URL!.includes('${');

describe.skipIf(!HAS_DB)('db.ts — Prisma backend（需真 DB 且已 seed）', () => {
  it('getTutorBySlug 找得到 Stan；hiddenScore 只在 server 端物件上', async () => {
    const db = await import('../lib/db');
    const t = await db.getTutorBySlug('stan-shih');
    expect(t).not.toBeNull();
    expect(t!.name).toBe('Stan Shih');
    expect(typeof t!.hiddenScore).toBe('number');
    expect('hiddenScore' in db.toPublic(t!)).toBe(false);
    expect(await db.getTutorBySlug('does-not-exist')).toBeNull();
  });

  it('getTutors 只回已發佈講師；reviews/endorsements 是結構化陣列', async () => {
    const db = await import('../lib/db');
    const all = await db.getTutors();
    expect(all.length).toBeGreaterThan(0);
    expect(Array.isArray(await db.getReviews(all[0].id))).toBe(true);
    expect(Array.isArray(await db.getEndorsements(all[0].id))).toBe(true);
  });
});
