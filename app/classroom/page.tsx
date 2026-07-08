// app/classroom/page.tsx —— 教室體驗示範頁（Server Component，SPEC §4.5）。
// 所有內容來自 data/classroom.json，含中英雙語欄位（xEn）；互動與語言挑選交給 _components 下的 client 子元件。
import type { Metadata } from 'next';
import classroom from '@/data/classroom.json';
import { PageHeader } from './_components/PageHeader';
import { Section } from './_components/Section';
import { MeetingCard } from './_components/MeetingCard';
import { AiSummary } from './_components/AiSummary';
import { ExerciseList, type Exercise } from './_components/ExerciseList';
import { KnowledgeQA } from './_components/KnowledgeQA';
import { CR } from './strings';

export const metadata: Metadata = {
  title: '教室體驗｜Classroom',
};

// 把本堂摘要串成一段純文字 context，餵給 /api/classroom-qa 的 Gemini 當回答依據。
// 中英欄位都帶進去，讓模型能用任一語言作答；只組字串、不動任何資料。
function buildCourseContext(c: typeof classroom): string {
  const { course, aiSummary } = c;
  const lines: string[] = [];
  lines.push(`課程 / Course: ${course.title}（${course.titleEn}） — ${course.sessionLabel} / ${course.sessionLabelEn}`);
  lines.push('');
  lines.push('章節時間軸 / Timeline:');
  for (const seg of aiSummary.timeline) {
    lines.push(`- ${seg.time} ${seg.title}（${seg.titleEn}）`);
  }
  lines.push('');
  lines.push('重點 / Key points:');
  aiSummary.keyPoints.forEach((p, i) => lines.push(`- ${p}（${aiSummary.keyPointsEn[i] ?? ''}）`));
  lines.push('');
  lines.push('名詞卡 / Glossary:');
  for (const term of aiSummary.termCards) {
    lines.push(`- ${term.term}（${term.termEn}）：${term.explain}`);
  }
  return lines.join('\n');
}

export default function ClassroomPage() {
  const { course, meeting, aiSummary, exercises, knowledgeQA } = classroom;
  const courseContext = buildCourseContext(classroom);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <PageHeader course={course} />

      <div className="mt-12 space-y-10">
        {/* 1. 上課資訊 */}
        <Section step={1} title={CR.meetHeading}>
          <MeetingCard meeting={meeting} />
        </Section>

        {/* 2. AI 課程摘要 */}
        <Section step={2} title={CR.summaryHeading}>
          <AiSummary summary={aiSummary} />
        </Section>

        {/* 3. 本課練習題 */}
        <Section step={3} title={CR.exercisesHeading}>
          <ExerciseList exercises={exercises as Exercise[]} />
        </Section>

        {/* 4. 課堂知識庫問答（罐頭） */}
        <Section step={4} title={CR.qaHeading}>
          <KnowledgeQA knowledgeQA={knowledgeQA} courseContext={courseContext} />
        </Section>
      </div>
    </div>
  );
}
