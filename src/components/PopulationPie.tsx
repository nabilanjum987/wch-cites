// Pure SVG/CSS population pie — no chart library, no client JavaScript.
// Server-rendered: the SVG paths AND the legend (label + figure +
// percentage for every slice) are in the initial HTML, so the figures are
// visible to crawlers and to a raw-HTML check, not just after hydration.
//
// Percentages are computed from the figures shown. They are rounded to
// two decimals, then the largest slice absorbs the rounding residual, so
// the printed percentages always sum to exactly 100.00% (the underlying
// figures are never adjusted). Returns null for fewer than two slices:
// a pie needs a real split, never a single number.

const PALETTE = [
  '#0C7A3D', // site green
  '#34d399',
  '#C8A951', // site gold
  '#60a5fa',
  '#f87171',
  '#fb923c',
  '#a78bfa',
  '#94a3b8',
  '#64748b',
];

export interface PieSliceInput {
  label: string;
  value: number;
}

interface PopulationPieProps {
  title: string;
  /** Census unit, e.g. "Karachi Division" — printed on the pie. */
  unit: string;
  slices: PieSliceInput[];
  /** Short source line, e.g. "PBS Census-2023, Table 9". */
  source: string;
  /** Optional explainer printed under the source line. */
  note?: string;
}

const fmt = (n: number): string => n.toLocaleString('en-US');

/** Two-decimal percentages that sum to exactly 100.00 (see header). */
function percentages(values: number[]): number[] {
  const total = values.reduce((sum, v) => sum + v, 0);
  if (total <= 0) return values.map(() => 0);
  const hundredths = values.map((v) => Math.round((v / total) * 10000));
  const residual = 10000 - hundredths.reduce((sum, h) => sum + h, 0);
  if (residual !== 0) {
    let largest = 0;
    values.forEach((v, i) => {
      if (v > values[largest]) largest = i;
    });
    hundredths[largest] += residual;
  }
  return hundredths.map((h) => h / 100);
}

function slicePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const toRad = (deg: number): number => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export default function PopulationPie({ title, unit, slices, source, note }: PopulationPieProps) {
  if (slices.length < 2) return null;
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return null;
  const pcts = percentages(slices.map((s) => s.value));

  const cx = 100;
  const cy = 100;
  const r = 90;
  let angle = 0;
  const paths = slices.map((slice, i) => {
    const sweep = (slice.value / total) * 360;
    const path = slicePath(cx, cy, r, angle, angle + sweep);
    angle += sweep;
    const color =
      slice.label === 'Religion not recorded' ? '#64748b' : PALETTE[i % PALETTE.length];
    return { ...slice, path, color };
  });

  return (
    <div
      data-population-pie={title}
      className="rounded-2xl p-5 border"
      style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}
    >
      <div className="text-white font-semibold text-sm">{title}</div>
      <div className="text-gray-500 text-xs mt-0.5">
        {unit} · Total {fmt(total)}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-5">
        <svg
          viewBox="0 0 200 200"
          className="w-44 h-44 flex-shrink-0"
          role="img"
          aria-label={`${title} for ${unit}`}
        >
          {paths.map((p) => (
            <path key={p.label} d={p.path} fill={p.color} stroke="#0a0f1e" strokeWidth="1" />
          ))}
        </svg>
        <ul className="w-full space-y-1.5 text-sm">
          {paths.map((p, i) => (
            <li key={p.label} className="flex items-baseline gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0 self-center"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-gray-300">{p.label}</span>
              <span className="text-gray-500 ml-auto text-right">
                {fmt(p.value)} · {pcts[i].toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs text-gray-500">Source: {source}</p>
      {note ? <p className="mt-1 text-xs text-gray-500">{note}</p> : null}
    </div>
  );
}
