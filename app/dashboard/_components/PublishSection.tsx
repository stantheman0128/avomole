'use client';
// app/dashboard/_components/PublishSection.tsx —— Slice 5：發佈開關。
// togglePublish(published true/false)。發佈後出現在 /tutors，並給「看我的公開頁 →」連到 /tutors/[slug]。
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { togglePublish, type ActionState } from '../actions';
import { s } from '../strings';
import type { EditableProfile } from './types';

export function PublishSection({ profile }: { profile: EditableProfile }) {
  const { t } = useLang();
  const [published, setPublished] = useState(profile.published);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      const res = await togglePublish(prev, formData);
      if (res?.ok) setPublished(formData.get('publish') === 'true');
      return res;
    },
    undefined,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${published ? 'bg-avo-main' : 'bg-avo-ink/25'}`}
          aria-hidden
        />
        <p className="text-sm text-avo-ink/80">{published ? t(s.publishOn) : t(s.publishOff)}</p>
      </div>

      <p className="text-sm text-avo-ink/60">{t(s.publishHint)}</p>

      <div className="flex flex-wrap items-center gap-4">
        <form action={formAction}>
          <input type="hidden" name="publish" value={published ? 'false' : 'true'} />
          <button
            type="submit"
            disabled={pending}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
              published
                ? 'border border-avo-main/40 text-avo-dark hover:bg-avo-light/40'
                : 'bg-avo-main text-white hover:bg-avo-dark'
            }`}
          >
            {published ? t(s.unpublishAction) : t(s.publishAction)}
          </button>
        </form>

        {published && (
          <Link
            href={`/tutors/${profile.slug}`}
            className="text-sm font-medium text-avo-main hover:text-avo-dark"
          >
            {t(s.viewPublic)}
          </Link>
        )}

        {state?.error && !pending && (
          <span role="alert" className="text-sm text-red-700">
            {t(s.saveFailed)}
          </span>
        )}
      </div>
    </div>
  );
}

export default PublishSection;
