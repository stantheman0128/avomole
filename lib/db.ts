// lib/db.ts —— server-only 資料存取層。全站唯一的資料入口。
// 兩種 backend：
//   預設走 SQLite（讀 data/avomole.db，由 scripts/seed.ts 產生）。
//   env DATA_BACKEND=json 時直接讀 data/tutors.json（部署環境 better-sqlite3 編譯失敗的退路）。
// 對外介面在兩種 backend 下完全一致。
import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { Tutor, Review, Endorsement, PublicTutor, TutorData, Level } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'avomole.db');
const JSON_PATH = path.join(DATA_DIR, 'tutors.json');
const SAMPLE_PATH = path.join(DATA_DIR, 'tutors.sample.json');

function useJsonBackend(): boolean {
  if (process.env.DATA_BACKEND === 'json') return true;
  // SQLite 檔不存在時也自動退 JSON（例如尚未 seed 的開發環境）
  return !fs.existsSync(DB_PATH);
}

// ---- JSON backend ----

let jsonCache: TutorData | null = null;

function readJsonData(): TutorData {
  if (jsonCache) return jsonCache;
  const file = fs.existsSync(JSON_PATH) ? JSON_PATH : SAMPLE_PATH;
  const raw = fs.readFileSync(file, 'utf-8');
  jsonCache = JSON.parse(raw) as TutorData;
  return jsonCache;
}

// ---- SQLite backend ----
// better-sqlite3 用 require 動態載入：DATA_BACKEND=json 時完全不觸碰這個原生模組，
// 部署環境即使編不出 .node 也不會炸。

interface SqliteStatement {
  all(...params: unknown[]): unknown[];
  get(...params: unknown[]): unknown;
}
interface SqliteDb {
  prepare(sql: string): SqliteStatement;
}

let sqliteDb: SqliteDb | null = null;

function getSqlite(): SqliteDb {
  if (sqliteDb) return sqliteDb;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Database = require('better-sqlite3') as new (p: string, o?: object) => SqliteDb;
  sqliteDb = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  return sqliteDb;
}

// SQLite 的 row → Tutor：JSON 欄位解碼、snake_case → camelCase、0/1 → boolean
interface TutorRow {
  id: number; slug: string; name: string; name_en: string; title: string;
  avatar: string; bio: string; hourly_rate: number; domains: string;
  skills: string; teach_levels: string; accepts_projects: number; is_real: number;
  hidden_score: number; ai_profile: string; github: string; portfolio: string; plans: string;
}

function rowToTutor(r: TutorRow): Tutor {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameEn: r.name_en,
    title: r.title,
    avatar: r.avatar,
    bio: r.bio,
    hourlyRate: r.hourly_rate,
    domains: JSON.parse(r.domains) as string[],
    skills: JSON.parse(r.skills) as string[],
    teachLevels: JSON.parse(r.teach_levels) as Level[],
    acceptsProjects: r.accepts_projects === 1,
    isReal: r.is_real === 1,
    hiddenScore: r.hidden_score,
    aiProfile: JSON.parse(r.ai_profile) as Tutor['aiProfile'],
    github: JSON.parse(r.github) as Tutor['github'],
    portfolio: JSON.parse(r.portfolio) as Tutor['portfolio'],
    plans: JSON.parse(r.plans) as Tutor['plans'],
  };
}

// ---- 公開 API（兩 backend 共用簽名）----

export function getTutors(): Tutor[] {
  if (useJsonBackend()) return readJsonData().tutors;
  const rows = getSqlite().prepare('SELECT * FROM tutors ORDER BY id').all() as TutorRow[];
  return rows.map(rowToTutor);
}

export function getTutorBySlug(slug: string): Tutor | null {
  if (useJsonBackend()) {
    return readJsonData().tutors.find((t) => t.slug === slug) ?? null;
  }
  const row = getSqlite().prepare('SELECT * FROM tutors WHERE slug = ?').get(slug) as TutorRow | undefined;
  return row ? rowToTutor(row) : null;
}

export function getReviews(tutorId: number): Review[] {
  if (useJsonBackend()) {
    return readJsonData().reviews.filter((r) => r.tutorId === tutorId);
  }
  const rows = getSqlite()
    .prepare('SELECT id, tutor_id as tutorId, author, rating, text FROM reviews WHERE tutor_id = ? ORDER BY id')
    .all(tutorId) as Review[];
  return rows;
}

export function getEndorsements(tutorId: number): Endorsement[] {
  if (useJsonBackend()) {
    return readJsonData().endorsements.filter((e) => e.tutorId === tutorId);
  }
  const rows = getSqlite()
    .prepare(
      'SELECT id, tutor_id as tutorId, endorser_name as endorserName, endorser_title as endorserTitle, quote FROM endorsements WHERE tutor_id = ? ORDER BY id',
    )
    .all(tutorId) as Endorsement[];
  return rows;
}

// 傳給 client 前必經：剝除 hiddenScore。hiddenScore 只准留在 server 端（AI prompt 用）。
export function toPublic(t: Tutor): PublicTutor {
  const { hiddenScore: _drop, ...pub } = t;
  void _drop;
  return pub;
}
