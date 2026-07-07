// app/discover/page.tsx —— 學生首頁 / 探索頁（Server Component）。原 app/page.tsx 原樣搬來，之後設計線再重設計。
// 讀 db、剝除 hiddenScore（toPublic）、算平均評分、蒐集名人推薦，把純資料傳給 client 的 HomeContent。
// 區塊 1（Nav）與 8（Footer）由 layout 全站處理。
import { getTutors, getReviews, getEndorsements, toPublic } from '@/lib/db';
import { HomeContent } from './_home/HomeContent';
import type { FeaturedTutor, HomeEndorsement } from './_home/HomeContent';

export const dynamic = 'force-dynamic';

// 平均評分（0–5），無評價回 0
function avgRating(tutorId: number): number {
  const reviews = getReviews(tutorId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}

// 精選 4 位：必含 Stan（isReal），其餘挑不同領域湊滿，維持展示廣度
function pickFeatured(): FeaturedTutor[] {
  const tutors = getTutors();
  const real = tutors.find((t) => t.isReal);
  const picked = real ? [real] : [];
  const preferredSlugs = ['wu-jian-lin', 'chen-wei-ting', 'zhang-xiao-han'];
  for (const slug of preferredSlugs) {
    if (picked.length >= 4) break;
    const t = tutors.find((x) => x.slug === slug && !picked.includes(x));
    if (t) picked.push(t);
  }
  // 保底：若上面湊不滿 4 位（資料異動時），用剩下的補
  for (const t of tutors) {
    if (picked.length >= 4) break;
    if (!picked.includes(t)) picked.push(t);
  }
  return picked.slice(0, 4).map((t) => ({ tutor: toPublic(t), rating: avgRating(t.id) }));
}

// 跨講師蒐集推薦，攤平後取 3 位「不同的」認證帳號（同一人只取第一則，避免推薦牆出現重複頭像）
function pickEndorsements(): HomeEndorsement[] {
  const flat: HomeEndorsement[] = [];
  const seen = new Set<string>();
  for (const t of getTutors()) {
    for (const e of getEndorsements(t.id)) {
      if (seen.has(e.endorserName)) continue;
      seen.add(e.endorserName);
      flat.push({ endorserName: e.endorserName, endorserTitle: e.endorserTitle, quote: e.quote });
    }
  }
  return flat.slice(0, 3);
}

export default async function HomePage() {
  const featured = pickFeatured();
  const endorsements = pickEndorsements();
  return <HomeContent featured={featured} endorsements={endorsements} />;
}
