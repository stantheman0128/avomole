'use client';
// components/RadarChart.tsx —— 六軸能力雷達圖，純 SVG 自繪（不引圖表庫，SPEC §4.3）。
// 軸：LLM、電腦視覺、ML 基礎、工程實務、教學經驗、社群影響力（0–100）。
import { useLang } from '@/lib/i18n';
import type { Tutor } from '@/lib/types';

type Radar = Tutor['aiProfile']['radar'];

const AXES: { key: keyof Radar; label: { zh: string; en: string } }[] = [
  { key: 'llm', label: { zh: 'LLM', en: 'LLM' } },
  { key: 'cv', label: { zh: '電腦視覺', en: 'Comp. Vision' } },
  { key: 'mlBasics', label: { zh: 'ML 基礎', en: 'ML Basics' } },
  { key: 'engineering', label: { zh: '工程實務', en: 'Engineering' } },
  { key: 'teaching', label: { zh: '教學經驗', en: 'Teaching' } },
  { key: 'influence', label: { zh: '社群影響力', en: 'Influence' } },
];

function pointOnAxis(cx: number, cy: number, radius: number, index: number, total: number, value: number) {
  // 從正上方開始、順時針；value 為 0–100 的比例
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = (radius * Math.max(0, Math.min(100, value))) / 100;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

export function RadarChart({ radar, size = 260 }: { radar: Radar; size?: number }) {
  const { t } = useLang();
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.34; // 留邊給軸標籤
  const rings = [25, 50, 75, 100];
  const n = AXES.length;

  const dataPoints = AXES.map((a, i) => pointOnAxis(cx, cy, radius, i, n, radar[a.key]));
  const dataPath = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={t({ zh: '講師能力雷達圖', en: 'Tutor skill radar chart' })}
    >
      {/* 同心多邊形格線 */}
      {rings.map((ring) => {
        const pts = AXES.map((_, i) => pointOnAxis(cx, cy, radius, i, n, ring))
          .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join(' ');
        return (
          <polygon
            key={ring}
            points={pts}
            fill="none"
            stroke="#2e4a1f"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
        );
      })}

      {/* 軸線 */}
      {AXES.map((_, i) => {
        const end = pointOnAxis(cx, cy, radius, i, n, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="#2e4a1f"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
        );
      })}

      {/* 數據多邊形 */}
      <polygon points={dataPath} fill="#6b9e3e" fillOpacity={0.35} stroke="#6b9e3e" strokeWidth={2} />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#2e4a1f" />
      ))}

      {/* 軸標籤 */}
      {AXES.map((a, i) => {
        const lp = pointOnAxis(cx, cy, radius + 16, i, n, 100);
        const anchor = Math.abs(lp.x - cx) < 4 ? 'middle' : lp.x < cx ? 'end' : 'start';
        return (
          <text
            key={a.key}
            x={lp.x}
            y={lp.y}
            fontSize={10}
            fill="#2e4a1f"
            textAnchor={anchor}
            dominantBaseline="middle"
          >
            {t(a.label)}
          </text>
        );
      })}
    </svg>
  );
}

export default RadarChart;
