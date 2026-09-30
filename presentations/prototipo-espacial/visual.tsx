import { useId } from 'react';
import type { PersistentProps } from '../../system/src/definition';

export function Decoration() {
  const gridId = useId();
  return <svg className="world-art" viewBox="-1200 -650 2400 1400" width="2400" height="1400"
    style={{ left: -1200, top: -650 }} aria-hidden="true">
    <defs>
      <pattern id={gridId} width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 80 0 H 0 V 80" fill="none" stroke="var(--grid)" strokeWidth="1" opacity=".6" />
      </pattern>
    </defs>
    <rect x="-1200" y="-650" width="2400" height="1400" fill={`url(#${gridId})`} />
    <path d="M -940 20 C -630 -350, -120 -350, 0 -60 S 740 480, 1030 150"
      fill="none" stroke="var(--accent)" strokeWidth="4" opacity=".42" strokeDasharray="18 20" />
    <circle cx="0" cy="0" r="570" fill="none" stroke="var(--graphic)" strokeWidth="2" opacity=".3" />
  </svg>;
}

export function Progress({ index, total }: PersistentProps) {
  return <div className="persistent-card">
    <strong>RECORRIDO ESPACIAL</strong><span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
  </div>;
}

export function ClosingMark() {
  return <div className="persistent-card"><strong>FIN DEL RECORRIDO</strong><span>✦</span></div>;
}
