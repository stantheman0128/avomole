'use client';
// app/dashboard/_components/BasicSection.tsx —— Slice 2：基本資料表單。
// title / bio / hourlyRate / acceptsProjects / domains(多選) / skills(tag) / teachLevels(多選) / githubUsername。
import { useActionState, useState } from 'react';
import type { Level } from '@/lib/types';
import { useLang } from '@/lib/i18n';
import { updateProfile, type ActionState } from '../actions';
import { DOMAINS, domainLabel, LEVELS, levelLabel, s, type Domain } from '../strings';
import type { EditableProfile } from './types';
import { Field, TextInput, TextArea, SaveRow } from './fields';

// 可多選的 chip 群組（domains / teachLevels 共用）
function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
  label,
}: {
  options: readonly T[];
  selected: T[];
  onToggle: (v: T) => void;
  label: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={on}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              on ? 'bg-avo-main text-avo-dark' : 'bg-avo-light/50 text-avo-dark hover:bg-avo-light'
            }`}
          >
            {label(o)}
          </button>
        );
      })}
    </div>
  );
}

const ERR: Record<string, { zh: string; en: string }> = {
  title: s.errTitleRequired,
  rate: s.errRateRange,
  forbidden: s.saveFailed,
  generic: s.saveFailed,
};

export function BasicSection({ profile }: { profile: EditableProfile }) {
  const { t } = useLang();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateProfile, undefined);

  // profile.domains 是 string[]，但值都在 DOMAINS 白名單內（server 存入時已過濾）→ 收斂成 Domain[]。
  const [domains, setDomains] = useState<Domain[]>(profile.domains.filter((d): d is Domain => (DOMAINS as readonly string[]).includes(d)));
  const [levels, setLevels] = useState<Level[]>(profile.teachLevels as Level[]);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [draft, setDraft] = useState('');

  const toggle = <T extends string>(list: T[], set: (v: T[]) => void, v: T) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const addSkill = () => {
    const v = draft.trim();
    if (v && !skills.includes(v) && skills.length < 30) setSkills([...skills, v]);
    setDraft('');
  };

  const err = state?.error ? t(ERR[state.error] ?? s.saveFailed) : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label={t(s.fieldTitle)}>
        <TextInput name="title" defaultValue={profile.title} placeholder={t(s.fieldTitlePlaceholder)} maxLength={80} />
      </Field>

      <Field label={t(s.fieldBio)}>
        <TextArea name="bio" defaultValue={profile.bio} placeholder={t(s.fieldBioPlaceholder)} maxLength={600} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t(s.fieldRate)}>
          <TextInput name="hourlyRate" type="number" min={0} max={99999} defaultValue={profile.hourlyRate} />
        </Field>
        <Field label={t(s.fieldGithub)}>
          <TextInput
            name="githubUsername"
            defaultValue={profile.githubUsername}
            placeholder={t(s.fieldGithubPlaceholder)}
            autoComplete="off"
          />
        </Field>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-avo-dark">
        <input
          type="checkbox"
          name="acceptsProjects"
          defaultChecked={profile.acceptsProjects}
          className="h-4 w-4 accent-avo-main"
        />
        {t(s.fieldProjects)}
      </label>

      {/* domains 多選：本地 state → hidden inputs 送出 */}
      <div>
        <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.fieldDomains)}</p>
        <ChipGroup
          options={DOMAINS}
          selected={domains}
          onToggle={(v) => toggle(domains, setDomains, v)}
          label={(v) => t(domainLabel[v])}
        />
        {domains.map((d) => (
          <input key={d} type="hidden" name="domains" value={d} />
        ))}
      </div>

      {/* teachLevels 多選 */}
      <div>
        <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.fieldLevels)}</p>
        <ChipGroup
          options={LEVELS}
          selected={levels}
          onToggle={(v) => toggle(levels, setLevels, v)}
          label={(v) => t(levelLabel[v])}
        />
        {levels.map((l) => (
          <input key={l} type="hidden" name="teachLevels" value={l} />
        ))}
      </div>

      {/* skills tag 輸入：本地 state → 一個逗號串 hidden input */}
      <div>
        <p className="mb-2 text-sm font-medium text-avo-dark">{t(s.fieldSkills)}</p>
        <div className="mb-2 flex flex-wrap gap-2">
          {skills.map((sk) => (
            <span
              key={sk}
              className="inline-flex items-center gap-1.5 rounded-full bg-avo-light/60 px-3 py-1 text-sm text-avo-dark"
            >
              {sk}
              <button
                type="button"
                onClick={() => setSkills(skills.filter((x) => x !== sk))}
                aria-label={`${t(s.remove)} ${sk}`}
                className="text-avo-ink/50 hover:text-avo-dark"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <TextInput
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder={t(s.fieldSkillsPlaceholder)}
            className="flex-1"
          />
          <button
            type="button"
            onClick={addSkill}
            className="rounded-full border border-avo-main/40 px-4 py-2.5 text-sm font-medium text-avo-dark transition-colors hover:bg-avo-light/40"
          >
            {t(s.add)}
          </button>
        </div>
        <input type="hidden" name="skills" value={skills.join(',')} />
      </div>

      <SaveRow pending={pending} ok={state?.ok} error={err} />
    </form>
  );
}

export default BasicSection;
