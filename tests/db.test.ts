import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import path from 'node:path';
import { buildDb, loadData } from '../scripts/seed';
import type { TutorData } from '../lib/types';

const DB_PATH = path.join(process.cwd(), 'data', 'avomole.db');
const data: TutorData = loadData();

// 兩種 backend 都必須：getTutorBySlug 找得到人、toPublic 一定剝掉 hiddenScore。
// 每個 it 前 vi.resetModules()，讓 db.ts 的模組層快取重置、依當下 env 選 backend。

describe('db.ts — JSON backend (DATA_BACKEND=json)', () => {
  beforeAll(() => {
    process.env.DATA_BACKEND = 'json';
  });
  afterAll(() => {
    delete process.env.DATA_BACKEND;
  });

  it('getTutorBySlug 回傳講師；toPublic 剝除 hiddenScore', async () => {
    vi.resetModules();
    const db = await import('../lib/db');
    const t = db.getTutorBySlug('stan-shih');
    expect(t).not.toBeNull();
    expect(t!.name).toBe('Stan Shih');
    expect(typeof t!.hiddenScore).toBe('number'); // server 端仍持有

    const pub = db.toPublic(t!);
    expect('hiddenScore' in pub).toBe(false);

    expect(db.getTutorBySlug('does-not-exist')).toBeNull();
  });
});

describe('db.ts — SQLite backend', () => {
  beforeAll(() => {
    delete process.env.DATA_BACKEND;
    buildDb(DB_PATH, data); // 確保 avomole.db 存在，走 SQLite 路徑
  });

  it('getTutorBySlug 回傳講師；toPublic 剝除 hiddenScore', async () => {
    vi.resetModules();
    const db = await import('../lib/db');
    const t = db.getTutorBySlug('stan-shih');
    expect(t).not.toBeNull();
    expect(t!.name).toBe('Stan Shih');
    expect(typeof t!.hiddenScore).toBe('number');

    const pub = db.toPublic(t!);
    expect('hiddenScore' in pub).toBe(false);
  });

  it('getTutors 回傳全部講師；getReviews 取得結構化陣列', async () => {
    vi.resetModules();
    const db = await import('../lib/db');
    const all = db.getTutors();
    expect(all.length).toBe(data.tutors.length);
    expect(Array.isArray(db.getReviews(all[0].id))).toBe(true);
    expect(Array.isArray(db.getEndorsements(all[0].id))).toBe(true);
  });
});
