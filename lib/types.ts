// lib/types.ts —— 逐字使用，欄位名不得改
export type Level = 'beginner' | 'intermediate' | 'advanced';
export interface Repo { name: string; desc: string; stars: number; lang: string; }
export interface Tutor {
  id: number; slug: string; name: string; nameEn: string;
  title: string; avatar: string; bio: string; hourlyRate: number;
  domains: string[]; skills: string[]; teachLevels: Level[];
  acceptsProjects: boolean; isReal: boolean; hiddenScore: number;
  aiProfile: {
    radar: { llm: number; cv: number; mlBasics: number; engineering: number; teaching: number; influence: number };
    summary: string; difficulty: number; reviewDigest: string;
  };
  github: { username: string; repos: Repo[]; langDist: Record<string, number>; activityNote: string };
  portfolio: { title: string; desc: string; link: string }[];
  plans: { name: string; price: number; desc: string }[];
}
export interface Review { id: number; tutorId: number; author: string; rating: number; text: string; }
export interface Endorsement { id: number; tutorId: number; endorserName: string; endorserTitle: string; quote: string; }

// 給 client 用的講師型別：hiddenScore 已被剝除，型別上就無法存取
export type PublicTutor = Omit<Tutor, 'hiddenScore'>;

// data/tutors.json / data/tutors.sample.json 的形狀
export interface TutorData {
  tutors: Tutor[];
  reviews: Review[];
  endorsements: Endorsement[];
}
