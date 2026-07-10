// app/roadmap/strings.ts —— /roadmap 完整產品藍圖頁的 UI 字串（雙語）。
// 值為 {zh, en}，交給 lib/i18n 的 t() 取字。站名／slogan 一律取自 lib/brand.ts，不寫死。
// 功能清單狀態四種：live（已上線）、liveDemo（已上線·靜態/示意）、planned（規劃中）、cannedDemo（Demo 罐頭）。
// 「已上線」的附去對應頁的連結；「規劃中／Demo」的配 DemoFrame 示意框（無真影片）。

export type Status = 'live' | 'liveDemo' | 'planned' | 'cannedDemo';

export interface Feature {
  id: string;
  title: { zh: string; en: string };
  line: { zh: string; en: string };
  status: Status;
  href?: string; // 只有 live / liveDemo 帶連結
}

export interface FeatureGroup {
  id: string;
  eyebrow: { zh: string; en: string };
  heading: { zh: string; en: string };
  lead: { zh: string; en: string };
  features: Feature[];
}

// 狀態徽章文案。planned / cannedDemo 會配 DemoFrame。
export const STATUS_LABEL: Record<Status, { zh: string; en: string }> = {
  live: { zh: '已上線', en: 'Live' },
  liveDemo: { zh: '已上線 · 示意', en: 'Live · demo data' },
  planned: { zh: '規劃中', en: 'Planned' },
  cannedDemo: { zh: 'Demo 展示', en: 'Demo build' },
};

export const ROADMAP = {
  kicker: { zh: '產品藍圖', en: 'Product roadmap' },
  heroTitle: {
    zh: '一張表看完酪梨想做的事。',
    en: 'The whole plan for the avocado, on one page.',
  },
  heroLead: {
    zh: '有些能力現在就能用，有些還在路上。已上線的直接帶你去看；還沒做的先放一格示範影片的位子，讓你知道長出來會是什麼樣子。',
    en: "Some of this you can use today; some is still on the way. What's live, we'll take you straight to. What's not, we leave a slot for its demo video, so you can see where it's headed.",
  },
  // 去看看 / demo 佔位的共用 UI 詞
  goSee: { zh: '去看看', en: 'Take a look' },
  demoCaption: { zh: 'Demo 影片（示意）', en: 'Demo video (placeholder)' },
  demoHint: {
    zh: '這個功能上線後，這裡會放一段實際操作的示範影片。',
    en: 'Once this ships, an actual walkthrough video will live here.',
  },
  // 從首頁「還在路上」區導過來的入口文案
  fromDiscover: { zh: '看完整產品藍圖', en: 'See the full roadmap' },
  // 頁尾一句收束
  footNote: {
    zh: '藍圖會隨著酪梨長大而更新。想先試已上線的部分，從上面任何一個「去看看」進去就行。',
    en: "The plan grows as the avocado does. To try what's already live, follow any of the links above.",
  },

  groups: [
    {
      id: 'supply',
      eyebrow: { zh: '供給側', en: 'Supply side' },
      heading: { zh: '給講師的工具', en: 'For tutors' },
      lead: {
        zh: '讓「教 AI 的人」被看見、被公正評估，也少花力氣在備課與行政上。',
        en: 'Make the people who teach AI visible, fairly assessed, and freed from busywork.',
      },
      features: [
        {
          id: 'profile',
          title: { zh: 'AI 能力側寫卡', en: 'AI capability profile' },
          line: {
            zh: '引擎讀完 GitHub、作品與教學經驗，生成一張能力雷達圖，不用自己寫落落長的自介。',
            en: 'The engine reads GitHub, projects and teaching history into a capability radar, so nobody writes a wall-of-text bio.',
          },
          status: 'live',
          href: '/tutors',
        },
        {
          id: 'github',
          title: { zh: 'GitHub 深度整合', en: 'Deep GitHub integration' },
          line: {
            zh: '把公開 repo 的語言分佈、專案規模與活躍度攤在檔案上，程度用資料說話。',
            en: 'Language mix, project scale and activity from public repos, laid out so skill speaks in data.',
          },
          status: 'live',
          href: '/tutors',
        },
        {
          id: 'endorsement',
          title: { zh: '名人認證推薦', en: 'Verified endorsements' },
          line: {
            zh: '認證帳號替講師背書，點頭的都是實際看過作品的人，不是刷出來的好評。',
            en: 'Verified accounts vouch for tutors — nods from people who actually saw the work, not padded praise.',
          },
          status: 'live',
          href: '/tutors',
        },
        {
          id: 'review-summary',
          title: { zh: '評價 AI 摘要', en: 'AI review digest' },
          line: {
            zh: '一堆學生評價由 AI 濃縮成幾句重點，優缺點一眼看完，不用逐則翻。',
            en: 'A pile of student reviews boiled down to a few lines — strengths and caveats at a glance.',
          },
          status: 'live',
          href: '/tutors',
        },
        {
          id: 'syllabus',
          title: { zh: 'AI 課綱產生器', en: 'AI syllabus generator' },
          line: {
            zh: '給一個主題與時數，AI 排出章節、練習與里程碑，講師改一改就能開課。',
            en: 'Give a topic and a time budget; AI drafts chapters, exercises and milestones for the tutor to tweak.',
          },
          status: 'live',
          href: '/syllabus',
        },
        {
          id: 'pricing',
          title: { zh: '定價建議', en: 'Pricing guidance' },
          line: {
            zh: '參考同領域、同程度講師的行情，給一個合理時薪區間，不用憑感覺喊價。',
            en: 'A sensible hourly range benchmarked against peers in the same domain and level, instead of guessing.',
          },
          status: 'live',
          href: '/pricing',
        },
        {
          id: 'video-intro',
          title: { zh: '影片自介 + AI 字幕', en: 'Video intro with AI captions' },
          line: {
            zh: '講師錄一段自我介紹，系統自動上雙語字幕與重點標記，學生不用戴耳機也看得懂。',
            en: 'Tutors record a short intro; the system adds bilingual captions and highlights, readable with the sound off.',
          },
          status: 'planned',
        },
      ],
    },
    {
      id: 'demand',
      eyebrow: { zh: '需求側', en: 'Demand side' },
      heading: { zh: '給學生的工具', en: 'For learners' },
      lead: {
        zh: '從「我想學 AI」到「我知道該找誰、照什麼順序學」，把中間的猶豫都交給酪梨。',
        en: 'From "I want to learn AI" to "I know who to ask and in what order" — let the avocado carry the middle.',
      },
      features: [
        {
          id: 'match-chat',
          title: { zh: 'AI 對話式媒合', en: 'AI conversational matching' },
          line: {
            zh: '用聊天講清楚程度、目標與預算，AI 直接挑出最合適的幾位講師。',
            en: 'Describe your level, goals and budget in a chat; AI picks the tutors that fit.',
          },
          status: 'live',
          href: '/match',
        },
        {
          id: 'browse',
          title: { zh: '課程導覽與分類', en: 'Course browsing and categories' },
          line: {
            zh: '六大 AI 領域切入，配上程度與時薪篩選，自己逛也能很快收斂。',
            en: 'Six AI domains, plus level and price filters, so browsing on your own converges fast.',
          },
          status: 'live',
          href: '/tutors',
        },
        {
          id: 'path',
          title: { zh: '學習路徑規劃', en: 'Learning path planner' },
          line: {
            zh: '給一個目標，AI 排出階段，每階段配上該學的課與合適的講師。',
            en: 'Give a goal; AI lays out stages, each with the right courses and tutors.',
          },
          status: 'live',
          href: '/learning-path',
        },
        {
          id: 'diagnosis',
          title: { zh: '程度自我診斷', en: 'Self-assessment' },
          line: {
            zh: '幾道題摸清你現在的底，媒合前先知道自己站在哪，別報了太深或太淺的課。',
            en: 'A few questions to gauge where you stand before matching, so you skip courses too deep or too shallow.',
          },
          status: 'live',
          href: '/assessment',
        },
        {
          id: 'reverse-match',
          title: { zh: '反向媒合', en: 'Reverse matching' },
          line: {
            zh: '把需求貼出來，讓合適的講師主動來找你，不用自己一個個翻。',
            en: 'Post your need and let suitable tutors come to you, instead of paging through the list.',
          },
          status: 'live',
          href: '/requests',
        },
        {
          id: 'compare',
          title: { zh: '講師並排比較', en: 'Side-by-side comparison' },
          line: {
            zh: '選幾位講師並排看能力、評價與價格，不用在分頁之間來回切。',
            en: 'Line up a few tutors to compare capability, reviews and price without tab-hopping.',
          },
          status: 'live',
          href: '/compare',
        },
      ],
    },
    {
      id: 'inclass',
      eyebrow: { zh: '課中與課後', en: 'In-class and after' },
      heading: { zh: '把每堂課榨乾的 AI', en: 'AI that wrings out every lesson' },
      lead: {
        zh: '上完課不是結束。錄影、作業、進度、知識都留下來，變成可以隨時回頭問的東西。',
        en: 'The lesson is not the end. Recordings, homework, progress and knowledge stay behind as something you can revisit.',
      },
      features: [
        {
          id: 'recap',
          title: { zh: '課程錄影 AI 摘要', en: 'AI recording recap' },
          line: {
            zh: '錄影自動生成章節時間軸、重點條列與名詞卡，下課不用自己整理筆記。',
            en: 'Recordings become a chapter timeline, key points and term cards — no note-taking afterward.',
          },
          status: 'live',
          href: '/classroom',
        },
        {
          id: 'knowledge-base',
          title: { zh: '個人學習知識庫', en: 'Personal knowledge base' },
          line: {
            zh: '把上過的每一堂課變成可問答的知識庫。教室頁的問答已接上真 AI，只根據本課內容回答。',
            en: 'Every class becomes a queryable knowledge base; the classroom Q&A now runs on real AI, answering from the course content.',
          },
          status: 'live',
          href: '/classroom',
        },
        {
          id: 'homework',
          title: { zh: '自動作業生成與批改', en: 'Auto homework and grading' },
          line: {
            zh: '依課程內容出題，交上去由 AI 批改並給修改建議。教室頁已有示意版可看。',
            en: 'Problems drawn from the course, graded by AI with feedback. A demo version is already on the classroom page.',
          },
          status: 'liveDemo',
          href: '/classroom',
        },
        {
          id: 'dashboard',
          title: { zh: '學習進度儀表板', en: 'Progress dashboard' },
          line: {
            zh: '把各課程的進度、練習表現與待補的地方集中成一張圖，知道下一步該補哪裡。',
            en: 'Progress, exercise results and gaps across courses in one view, pointing at what to shore up next.',
          },
          status: 'liveDemo',
          href: '/progress',
        },
      ],
    },
  ] satisfies FeatureGroup[],
} as const;
