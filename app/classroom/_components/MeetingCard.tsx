'use client';
// 上課資訊卡：Meet 連結按鈕、進教室三步驟、錄影告知。步驟與告知文字來自 json，中英雙語。
import { useLang } from '@/lib/i18n';
import { CR } from '../strings';
import { JoinMeetButton } from './JoinMeetButton';

type Step = { step: number; title: string; titleEn?: string; desc: string; descEn?: string };
export type Meeting = {
  meetUrl: string;
  recordingNote: string;
  recordingNoteEn?: string;
  joinSteps: Step[];
};

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  const { lang, t } = useLang();
  const en = lang === 'en';
  const recordingNote = en ? meeting.recordingNoteEn ?? meeting.recordingNote : meeting.recordingNote;

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
      {/* 三步驟 */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-avo-dark">{t(CR.joinStepsTitle)}</h3>
        <ol className="space-y-3">
          {meeting.joinSteps.map((s) => (
            <li key={s.step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-avo-light font-mono text-xs text-avo-dark">
                {s.step}
              </span>
              <div>
                <p className="text-sm font-medium text-avo-ink">{en ? s.titleEn ?? s.title : s.title}</p>
                <p className="text-sm text-avo-ink/70">{en ? s.descEn ?? s.desc : s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 連結 + 錄影告知 */}
      <div className="flex flex-col gap-4 rounded-2xl bg-avo-light/40 p-4">
        <div>
          <JoinMeetButton url={meeting.meetUrl} />
          <p className="mt-2 text-xs text-avo-ink/50">{t(CR.joinButtonHint)}</p>
          <p className="mt-1 break-all font-mono text-xs text-avo-seed">{meeting.meetUrl}</p>
        </div>
        <div className="border-t border-avo-main/20 pt-3">
          <p className="font-mono text-xs text-avo-seed">{t(CR.recordingLabel)}</p>
          <p className="mt-1 text-sm text-avo-ink/80">{recordingNote}</p>
        </div>
      </div>
    </div>
  );
}

export default MeetingCard;
