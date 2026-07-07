// app/classroom/page.tsx —— 教室體驗示範頁（Server Component，SPEC §4.5）。
// 所有內容來自 data/classroom.json；互動部分交給 _components 下的 client 子元件。
import type { Metadata } from 'next';
import classroom from '@/data/classroom.json';
import { PageHeader } from './_components/PageHeader';
import { Section, DemoContentNote } from './_components/Section';
import { MeetingCard } from './_components/MeetingCard';
import { AiSummary } from './_components/AiSummary';
import { ExerciseList, type Exercise } from './_components/ExerciseList';
import { KnowledgeQA } from './_components/KnowledgeQA';
import { CR } from './strings';

export const metadata: Metadata = {
  title: '教室體驗｜Classroom',
};

export default function ClassroomPage() {
  const { course, meeting, aiSummary, exercises, knowledgeQA } = classroom;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <PageHeader
        title={course.title}
        subtitle={course.subtitle}
        sessionLabel={course.sessionLabel}
        tutorName={course.tutorName}
        durationMin={course.durationMin}
      />

      <div className="mt-12 space-y-10">
        {/* 1. 上課資訊 */}
        <Section step={1} title={CR.meetHeading}>
          <MeetingCard
            meetUrl={meeting.meetUrl}
            recordingNote={meeting.recordingNote}
            joinSteps={meeting.joinSteps}
          />
        </Section>

        {/* 2. AI 課程摘要 */}
        <Section step={2} title={CR.summaryHeading}>
          <DemoContentNote />
          <AiSummary
            generatedNote={aiSummary.generatedNote}
            timeline={aiSummary.timeline}
            keyPoints={aiSummary.keyPoints}
            termCards={aiSummary.termCards}
          />
        </Section>

        {/* 3. 本課練習題 */}
        <Section step={3} title={CR.exercisesHeading}>
          <DemoContentNote />
          <ExerciseList exercises={exercises as Exercise[]} />
        </Section>

        {/* 4. 課堂知識庫問答（罐頭） */}
        <Section step={4} title={CR.qaHeading}>
          <DemoContentNote />
          <KnowledgeQA presets={knowledgeQA.presets} />
        </Section>
      </div>
    </div>
  );
}
