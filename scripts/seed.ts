// scripts/seed.ts —— 從 data/tutors.json 產生 data/avomole.db（SQLite）。
// 執行：npm run seed。產出的 .db 隨 repo 提交，部署時直接用。
// buildDb / loadData 匯出給測試重用。env DATA_BACKEND=json 時 SQLite 路徑用不到，本腳本不影響部署。
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import type { TutorData } from '../lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'avomole.db');
const JSON_PATH = path.join(DATA_DIR, 'tutors.json');
const SAMPLE_PATH = path.join(DATA_DIR, 'tutors.sample.json');

const SCHEMA = `
CREATE TABLE tutors (
  id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, name_en TEXT,
  title TEXT, avatar TEXT, bio TEXT, hourly_rate INTEGER,
  domains TEXT, skills TEXT, teach_levels TEXT,
  accepts_projects INTEGER, is_real INTEGER,
  hidden_score REAL, ai_profile TEXT, github TEXT, portfolio TEXT, plans TEXT
);
CREATE TABLE endorsements (
  id INTEGER PRIMARY KEY, tutor_id INTEGER,
  endorser_name TEXT, endorser_title TEXT, quote TEXT
);
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY, tutor_id INTEGER,
  author TEXT, rating INTEGER, text TEXT
);
`;

export function loadData(): TutorData {
  const file = fs.existsSync(JSON_PATH) ? JSON_PATH : SAMPLE_PATH;
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as TutorData;
}

export function buildDb(dbPath: string, data: TutorData): void {
  if (fs.existsSync(dbPath)) fs.rmSync(dbPath);
  const db = new Database(dbPath);
  db.exec(SCHEMA);

  const insTutor = db.prepare(`INSERT INTO tutors
    (id, slug, name, name_en, title, avatar, bio, hourly_rate, domains, skills, teach_levels,
     accepts_projects, is_real, hidden_score, ai_profile, github, portfolio, plans)
    VALUES (@id, @slug, @name, @name_en, @title, @avatar, @bio, @hourly_rate, @domains, @skills, @teach_levels,
     @accepts_projects, @is_real, @hidden_score, @ai_profile, @github, @portfolio, @plans)`);
  const insEndorse = db.prepare(`INSERT INTO endorsements
    (id, tutor_id, endorser_name, endorser_title, quote)
    VALUES (@id, @tutor_id, @endorser_name, @endorser_title, @quote)`);
  const insReview = db.prepare(`INSERT INTO reviews
    (id, tutor_id, author, rating, text)
    VALUES (@id, @tutor_id, @author, @rating, @text)`);

  const tx = db.transaction((d: TutorData) => {
    for (const t of d.tutors) {
      insTutor.run({
        id: t.id, slug: t.slug, name: t.name, name_en: t.nameEn, title: t.title,
        avatar: t.avatar, bio: t.bio, hourly_rate: t.hourlyRate,
        domains: JSON.stringify(t.domains), skills: JSON.stringify(t.skills),
        teach_levels: JSON.stringify(t.teachLevels),
        accepts_projects: t.acceptsProjects ? 1 : 0, is_real: t.isReal ? 1 : 0,
        hidden_score: t.hiddenScore,
        ai_profile: JSON.stringify(t.aiProfile), github: JSON.stringify(t.github),
        portfolio: JSON.stringify(t.portfolio), plans: JSON.stringify(t.plans),
      });
    }
    for (const e of d.endorsements) {
      insEndorse.run({
        id: e.id, tutor_id: e.tutorId, endorser_name: e.endorserName,
        endorser_title: e.endorserTitle, quote: e.quote,
      });
    }
    for (const r of d.reviews) {
      insReview.run({ id: r.id, tutor_id: r.tutorId, author: r.author, rating: r.rating, text: r.text });
    }
  });
  tx(data);
  db.close();
}

function isMain(): boolean {
  const arg = (process.argv[1] ?? '').replace(/\\/g, '/');
  return arg.endsWith('/seed.ts') || arg.endsWith('/seed.js');
}

if (isMain()) {
  const data = loadData();
  buildDb(DB_PATH, data);
  console.log(
    `seeded ${data.tutors.length} tutors, ${data.reviews.length} reviews, ` +
      `${data.endorsements.length} endorsements -> ${DB_PATH}`,
  );
}
