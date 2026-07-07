// app/dashboard/_components/types.ts —— 講師編輯器共用型別。
// EditableProfile 是傳進 client 的形狀：刻意不含 hiddenScore（server-only，型別上就拿不到）。
import type { Tutor } from '@/lib/types';

export type Radar = Tutor['aiProfile']['radar'];
export type AiProfile = Tutor['aiProfile'];
export type PortfolioItem = Tutor['portfolio'][number];
export type PlanItem = Tutor['plans'][number];

// 傳給編輯器的講師草稿：Omit hiddenScore，其餘欄位對映 TutorProfile。
export interface EditableProfile {
  slug: string;
  title: string;
  bio: string;
  avatar: string;
  hourlyRate: number;
  acceptsProjects: boolean;
  domains: string[];
  skills: string[];
  teachLevels: string[];
  githubUsername: string;
  published: boolean;
  aiProfile: AiProfile;
  portfolio: PortfolioItem[];
  plans: PlanItem[];
}
