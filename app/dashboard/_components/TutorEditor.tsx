'use client';
// app/dashboard/_components/TutorEditor.tsx —— 講師頁編輯器（client）。
// 只吃 server 剝好的 EditableProfile（無 hiddenScore）。分五區：基本資料 / 側寫卡 / 作品集 / 方案 / 發佈。
// 編輯風：avo-panel 版塊 + serif 大標 + avo-rule 分隔，RWD 到 390px。
import { useLang } from '@/lib/i18n';
import { s } from '../strings';
import type { EditableProfile } from './types';
import { BasicSection } from './BasicSection';
import { AiProfileSection } from './AiProfileSection';
import { WorkSection } from './WorkSection';
import { PublishSection } from './PublishSection';

// 區塊標頭：mono kicker + serif 大標
export function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="avo-kicker">{kicker}</p>
      <h2 className="avo-display mt-2 text-2xl text-avo-dark">{title}</h2>
    </div>
  );
}

export function TutorEditor({ profile }: { profile: EditableProfile }) {
  const { t } = useLang();

  return (
    <div className="mt-10 flex flex-col gap-10">
      <section className="avo-panel rounded-2xl p-5 sm:p-6">
        <SectionHead kicker={t(s.basicKicker)} title={t(s.basicTitle)} />
        <BasicSection profile={profile} />
      </section>

      <hr className="avo-rule" />

      <section className="avo-panel rounded-2xl p-5 sm:p-6">
        <SectionHead kicker={t(s.aiKicker)} title={t(s.aiTitle)} />
        <AiProfileSection profile={profile} />
      </section>

      <hr className="avo-rule" />

      {/* 作品集 + 方案：兩個版塊，同一顆儲存鈕（同一個 action 一次存） */}
      <WorkSection profile={profile} />

      <hr className="avo-rule" />

      <section className="avo-panel rounded-2xl p-5 sm:p-6">
        <SectionHead kicker={t(s.publishKicker)} title={t(s.publishTitle)} />
        <PublishSection profile={profile} />
      </section>
    </div>
  );
}

export default TutorEditor;
