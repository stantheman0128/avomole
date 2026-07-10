// app/discover/page.tsx —— 舊學生首頁。已與 `/` 合併；永久導向唯一訪客主線。
import { redirect } from 'next/navigation';

export default function DiscoverPage() {
  redirect('/');
}
