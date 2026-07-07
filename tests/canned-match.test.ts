import { describe, it, expect } from 'vitest';
import { loadData } from '../scripts/seed';
import { cannedMatch } from '../lib/canned-match';

const { tutors } = loadData();

describe('cannedMatch', () => {
  it('推薦含 LLM 應用領域講師（fine-tuning 需求）', () => {
    const result = cannedMatch('我有 Python 基礎，想學 fine-tuning', tutors);

    // 回傳 1–2 筆
    expect(result.recommendations.length).toBeGreaterThanOrEqual(1);
    expect(result.recommendations.length).toBeLessThanOrEqual(2);

    // 每個 slug 都存在於 tutors
    const slugs = new Set(tutors.map((t) => t.slug));
    for (const rec of result.recommendations) {
      expect(slugs.has(rec.slug)).toBe(true);
      expect(rec.reason.length).toBeGreaterThan(0);
    }

    // 至少一位推薦講師的 domains 含「LLM 應用」
    const bySlug = new Map(tutors.map((t) => [t.slug, t]));
    const hasLLM = result.recommendations.some((rec) =>
      bySlug.get(rec.slug)?.domains.includes('LLM 應用'),
    );
    expect(hasLLM).toBe(true);
  });

  it('沒命中任何領域時退回通用推薦（1–2 筆、slug 皆存在）', () => {
    const result = cannedMatch('哈囉你好', tutors);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(1);
    expect(result.recommendations.length).toBeLessThanOrEqual(2);
    const slugs = new Set(tutors.map((t) => t.slug));
    for (const rec of result.recommendations) {
      expect(slugs.has(rec.slug)).toBe(true);
    }
  });

  it('輸出 JSON 完全不含 hiddenScore 字樣', () => {
    const result = cannedMatch('我想學 RAG 跟 agent', tutors);
    const json = JSON.stringify(result);
    expect(json).not.toContain('hiddenScore');
    expect(json).not.toContain('hidden_score');
  });
});
