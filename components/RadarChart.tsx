'use client';
// components/RadarChart.tsx —— 六軸能力雷達圖，純 SVG 自繪（不引圖表庫）。
// 軸：LLM、電腦視覺、ML 基礎、工程實務、教學經驗、社群影響力（0–100）。
// compact：講師卡縮圖用，無軸標。
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
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = (radius * Math.max(0, Math.min(100, value))) / 100;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

export function RadarChart({
  radar,
  size = 260,
  compact = false,
}: {
  radar: Radar;
  size?: number;
  /** 卡片縮圖：無軸標、較滿半徑 */
  compact?: boolean;
}) {
  const { t } = useLang();
  const cx = size / 2;
  const cy = size / 2;
  const radius = compact ? size * 0.42 : size * 0.34;
  const rings = compact ? [50, 100] : [25, 50, 75, 100];
  const n = AXES.length;

  const ink = 'var(--color-avo-ink)';
  const main = 'var(--color-avo-main)';
  const dark = 'var(--color-avo-dark)';

  const dataPoints = AXES.map((a, i) => pointOnAxis(cx, cy, radius, i, n, radar[a.key]));
  const dataPath = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={t({ zh: '講師能力雷達圖', en: 'Tutor skill radar chart' })}
      className={compact ? 'shrink-0' : undefined}
    >
      {rings.map((ring) => {
        const pts = AXES.map((_, i) => pointOnAxis(cx, cy, radius, i, n, ring))
          .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join(' ');
        return (
          <polygon
            key={ring}
            points={pts}
            fill="none"
            stroke={ink}
            strokeOpacity={compact ? 0.12 : 0.14}
            strokeWidth={1}
          />
        );
      })}

      {AXES.map((_, i) => {
        const end = pointOnAxis(cx, cy, radius, i, n, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke={ink}
            strokeOpacity={compact ? 0.12 : 0.14}
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={dataPath}
        fill={main}
        fillOpacity={compact ? 0.35 : 0.28}
        stroke={main}
        strokeWidth={compact ? 1.5 : 2}
      />
      {!compact &&
        dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={dark} />
        ))}

      {!compact &&
        AXES.map((a, i) => {
          const lp = pointOnAxis(cx, cy, radius + 16, i, n, 100);
          const anchor = Math.abs(lp.x - cx) < 4 ? 'middle' : lp.x < cx ? 'end' : 'start';
          return (
            <text
              key={a.key}
              x={lp.x}
              y={lp.y}
              fontSize={10}
              fill={dark}
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
