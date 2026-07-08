// app/requests/page.tsx —— 反向媒合：學生需求牆（Server Component）。
// 讀 open 需求（含發文者名字）→ 交給 client 列表；登入者才看到發需求表單。
// 講師與否、發文者名字都由 server 決定；hiddenScore 之類的敏感欄位這頁完全不碰。
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RequestsHeader } from './_components/RequestsHeader';
import { RequestForm } from './_components/RequestForm';
import { RequestList, type RequestItem } from './_components/RequestList';

export const dynamic = 'force-dynamic';

export default async function RequestsPage() {
  const session = await auth();
  const viewerRole = session?.user?.role ?? null;
  const loggedIn = Boolean(session?.user?.id);

  const rows = await prisma.studentRequest.findMany({
    where: { status: 'open' },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
  });

  // Date 不能原樣跨 server→client：createdAt 轉 ISO 字串，相對時間在 client 算。
  const items: RequestItem[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    budget: r.budget,
    level: r.level,
    domain: r.domain,
    createdAt: r.createdAt.toISOString(),
    authorName: r.user.name,
  }));

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-14 sm:py-20">
      <RequestsHeader />
      {loggedIn && <RequestForm />}
      <RequestList items={items} viewerRole={viewerRole} />
    </section>
  );
}
