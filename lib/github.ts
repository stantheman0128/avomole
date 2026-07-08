// lib/github.ts —— server-only。抓真實 GitHub 公開資料，湊成講師 side 的 GithubData。
// 沒 GITHUB_TOKEN 也能跑（未認證 60 req/hr，demo 夠用）；使用者不存在／被限流／網路錯都回 null，
// 呼叫端據此走 fallback（維持原 github 欄），不炸整個生成流程。
import 'server-only';
import type { GithubData, Repo } from './types';

const TIMEOUT_MS = 10_000;
const API = 'https://api.github.com';

// GitHub API 回傳的 repo 形狀（只取用得到的欄位）。
interface GhRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
}

interface GhUser {
  login: string;
  public_repos: number;
}

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // GitHub 要求帶 User-Agent，否則 403。
    'User-Agent': 'guacamole-ai-tutor-profiler',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

// 帶 10 秒 timeout 的 fetch。逾時／網路錯 → 回 null。
async function getJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: headers(),
      signal: controller.signal,
      cache: 'no-store',
    });
    // 404（帳號不存在）、403（限流／被擋）、其他非 2xx 一律當抓不到。
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// star 最高前 5 個 repo（排除 fork，優先呈現本人作品）。
function topRepos(repos: GhRepo[]): Repo[] {
  return repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      desc: (r.description ?? '').trim(),
      stars: r.stargazers_count,
      lang: r.language ?? '',
    }));
}

// 語言分佈：以各 repo 的 primary language 計數 → 轉百分比（整數，加總約 100）。
function langDist(repos: GhRepo[]): Record<string, number> {
  const counts = new Map<string, number>();
  for (const r of repos) {
    if (r.fork || !r.language) continue;
    counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return {};
  const dist: Record<string, number> = {};
  // 取前 6 種語言，避免橫條被長尾塞爆。
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  for (const [lang, n] of sorted) {
    dist[lang] = Math.round((n / total) * 100);
  }
  return dist;
}

// 用最近更新的 repo 數 + 最後活躍時間湊一句中文近況。
function activityNote(user: GhUser, repos: GhRepo[]): string {
  const own = repos.filter((r) => !r.fork);
  const now = Date.now();
  const DAY = 86_400_000;
  const recent = own.filter((r) => now - new Date(r.updated_at).getTime() < 90 * DAY).length;

  const latest = own
    .map((r) => new Date(r.updated_at).getTime())
    .filter((t) => !Number.isNaN(t))
    .sort((a, b) => b - a)[0];

  const parts: string[] = [`公開 ${user.public_repos} 個 repo`];
  if (recent > 0) parts.push(`近三個月更新 ${recent} 個`);
  if (latest) {
    const days = Math.floor((now - latest) / DAY);
    if (days <= 1) parts.push('最近一天內仍有提交');
    else if (days <= 30) parts.push(`最後活躍於 ${days} 天前`);
    else parts.push(`最後活躍約在 ${Math.round(days / 30)} 個月前`);
  }
  return parts.join('，') + '。';
}

// 抓一位 GitHub 使用者的公開側寫。任何一步失敗（帳號不存在／限流／網路錯／逾時）都回 null。
export async function fetchGithubProfile(username: string): Promise<GithubData | null> {
  const login = username.trim().replace(/^@/, '');
  if (!login) return null;
  const safe = encodeURIComponent(login);

  const user = await getJson<GhUser>(`${API}/users/${safe}`);
  if (!user) return null;

  const repos = await getJson<GhRepo[]>(
    `${API}/users/${safe}/repos?sort=updated&per_page=100`,
  );
  if (!Array.isArray(repos)) return null;

  return {
    username: user.login,
    repos: topRepos(repos),
    langDist: langDist(repos),
    activityNote: activityNote(user, repos),
  };
}

// 把 GithubData 壓成給 Gemini prompt 的一段文字摘要，讓側寫反映真實作品。
export function githubSummaryForPrompt(gh: GithubData): string {
  const lines: string[] = [`GitHub 帳號 @${gh.username}`];

  const langs = Object.entries(gh.langDist).sort((a, b) => b[1] - a[1]);
  if (langs.length > 0) {
    lines.push(
      '主要語言：' + langs.map(([lang, pct]) => `${lang} ${pct}%`).join('、'),
    );
  }
  if (gh.repos.length > 0) {
    const repoLines = gh.repos.map(
      (r) =>
        `- ${r.name}（${r.lang || '未標語言'}，★${r.stars}）${r.desc ? '：' + r.desc : ''}`,
    );
    lines.push('代表 repo（依星數）：\n' + repoLines.join('\n'));
  }
  if (gh.activityNote) lines.push('活躍度：' + gh.activityNote);

  return lines.join('\n');
}
