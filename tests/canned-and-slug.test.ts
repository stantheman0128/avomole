import { describe, it, expect } from 'vitest';
import { baseSlug, deriveHiddenScore } from '../app/dashboard/profile';
import { cannedSyllabus, cannedPricing } from '../lib/gemini-tools';
import { cannedLearningPath } from '../lib/gemini-features';

const DOMAINS = ['LLM 應用', 'Agent 開發', '電腦視覺', 'MLOps', '資料科學', 'AI 入門'];

// 回歸：中文名講師曾拿到含 CJK 的 slug → 公開頁 404（2026-07-08 修）。slug 必須 ASCII-safe。
describe('baseSlug — ASCII-safe（CJK slug 404 回歸）', () => {
  it('英文名照 kebab', () => {
    expect(baseSlug('Stan Shih', null)).toBe('stan-shih');
  });
  it('全中文名 strip 後退回 email 帳號', () => {
    expect(baseSlug('王大明老師', 'tutor3-123@example.com')).toBe('tutor3-123');
  });
  it('名字與 email 都擠不出 ASCII 就退 tutor', () => {
    expect(baseSlug('王', '王@例子.com')).toBe('tutor');
  });
  it('輸出永遠只含 a-z0-9-', () => {
    for (const s of [
      baseSlug('Demo 講師 阿福', 'ghtutor@example.com'),
      baseSlug('  Ada Lovelace!! ', null),
      baseSlug(null, 'someone+tag@example.com'),
    ]) {
      expect(s).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe('deriveHiddenScore — server 推導、值域固定', () => {
  it('結果落在 0-100', () => {
    const flat = { llm: 0, cv: 0, mlBasics: 0, engineering: 0, teaching: 0, influence: 0 };
    const max = { llm: 100, cv: 100, mlBasics: 100, engineering: 100, teaching: 100, influence: 100 };
    for (const r of [flat, max]) {
      const score = deriveHiddenScore(r);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});

// 罐頭退路是「沒 key 也不能白屏」的最後防線：形狀不變量要鎖住。
describe('罐頭退路不變量', () => {
  it('cannedSyllabus 回 4-8 週、雙語都有內容', () => {
    for (const lang of ['zh', 'en'] as const) {
      const s = cannedSyllabus('LoRA', 'beginner', lang);
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.weeks.length).toBeGreaterThanOrEqual(4);
      expect(s.weeks.length).toBeLessThanOrEqual(8);
      for (const w of s.weeks) {
        expect(w.title.length).toBeGreaterThan(0);
        expect(w.points.length).toBeGreaterThan(0);
      }
    }
  });

  it('cannedPricing 六領域 low<=high 且為正', () => {
    for (const d of DOMAINS) {
      for (const lang of ['zh', 'en'] as const) {
        const p = cannedPricing(d, lang);
        expect(p.low).toBeGreaterThan(0);
        expect(p.high).toBeGreaterThanOrEqual(p.low);
        expect(p.reason.length).toBeGreaterThan(0);
      }
    }
  });

  it('cannedLearningPath 每階段 domain 都對得到六領域（才配得出講師）', () => {
    for (const lang of ['zh', 'en'] as const) {
      const stages = cannedLearningPath(lang);
      expect(stages.length).toBeGreaterThanOrEqual(3);
      for (const st of stages) {
        expect(DOMAINS).toContain(st.domain);
      }
    }
  });
});
