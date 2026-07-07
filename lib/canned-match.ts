// lib/canned-match.ts —— 純函式罐頭媒合，無 side effect。
// Gemini 失敗／逾時／無 key 時的退路：關鍵字比對領域 → 依 hiddenScore 取前 2 位。
// 【鐵則】回傳物件只含 slug + reason，絕不洩漏 hiddenScore。
import type { Tutor } from './types';

export interface MatchResult {
  reply: string;
  recommendations: { slug: string; reason: string }[];
}

// 關鍵字 → 領域（領域字串須與 data/tutors.json 的 domains 完全一致）。
// key 一律小寫，比對前把使用者輸入轉小寫。
const KEYWORD_DOMAINS: { keywords: string[]; domain: string }[] = [
  { domain: 'LLM 應用', keywords: ['fine-tun', '微調', 'lora', 'rag', '檢索', 'llm', 'gpt', '大模型'] },
  { domain: 'Agent 開發', keywords: ['agent', '代理', '工具呼叫', 'autogpt'] },
  { domain: '電腦視覺', keywords: ['影像', '視覺', 'cv', 'vision', 'yolo', '影片'] },
  { domain: 'MLOps', keywords: ['部署', '上線', 'mlops', 'pipeline', 'monitor'] },
  { domain: '資料科學', keywords: ['資料', '分析', 'data', 'pandas', '統計', '特徵'] },
  { domain: 'AI 入門', keywords: ['新手', '入門', '零基礎', 'beginner', '不會寫程式'] },
];

function matchedDomains(text: string): string[] {
  const lower = text.toLowerCase();
  const hit: string[] = [];
  for (const { domain, keywords } of KEYWORD_DOMAINS) {
    if (keywords.some((k) => lower.includes(k))) hit.push(domain);
  }
  return hit;
}

// 引用講師具體技能／專案／評價，湊一句推薦理由。
function reasonFor(t: Tutor): string {
  const skills = t.skills.slice(0, 2).join('、');
  const summary = t.aiProfile.summary;
  const clause = summary.length > 60 ? summary.slice(0, 58) + '…' : summary;
  return `${t.title}，擅長 ${skills}。${clause}`;
}

const byScoreDesc = (a: Tutor, b: Tutor) => b.hiddenScore - a.hiddenScore;

export function cannedMatch(text: string, tutors: Tutor[]): MatchResult {
  const domains = matchedDomains(text);

  let picked: Tutor[];
  let generic = false;
  if (domains.length > 0) {
    const domainSet = new Set(domains);
    picked = tutors
      .filter((t) => t.domains.some((d) => domainSet.has(d)))
      .sort(byScoreDesc)
      .slice(0, 2);
    // 領域命中但剛好沒對應講師時，退回全體前 2 位。
    if (picked.length === 0) {
      picked = [...tutors].sort(byScoreDesc).slice(0, 2);
      generic = true;
    }
  } else {
    picked = [...tutors].sort(byScoreDesc).slice(0, 2);
    generic = true;
  }

  const recommendations = picked.map((t) => ({ slug: t.slug, reason: reasonFor(t) }));

  let reply: string;
  if (picked.length === 0) {
    reply = '目前平臺上還沒有完全對得上的講師，你可以換個說法，或直接逛逛講師列表。';
  } else {
    const names = picked.map((t) => t.name).join('、');
    if (generic) {
      reply = `幫你挑了 ${names} 這兩位，都是平臺上綜合實力不錯、教學口碑好的講師。想更精準的話，多告訴我一點你的程度、預算和想做的題目。`;
    } else {
      const domainText = domains.join('、');
      reply = `聽起來你想往「${domainText}」的方向走，我推薦 ${names}。理由寫在下面的卡片裡，點進去可以看完整側寫。`;
    }
  }

  return { reply, recommendations };
}
