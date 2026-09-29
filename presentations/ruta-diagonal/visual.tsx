import type { PersistentProps } from '../../system/src/definition';

export function Decoration() {
  return <svg className="world-art" viewBox="-1050 -800 2250 2100" width="2250" height="2100"
    style={{ left: -1050, top: -800 }} aria-hidden="true">
    <path d="M -700 -410 L 600 770" fill="none" stroke="var(--accent)"
      strokeWidth="7" strokeDasharray="28 20" opacity=".48" />
    <circle cx="-360" cy="-400" r="270" fill="none" stroke="var(--graphic)" strokeWidth="3" opacity=".45" />
    <circle cx="570" cy="770" r="330" fill="none" stroke="var(--graphic)" strokeWidth="3" opacity=".45" />
    <path d="M -950 400 H 1100 M 60 -720 V 1150" fill="none"
      stroke="var(--grid)" strokeWidth="3" opacity=".65" />
  </svg>;
}

export function RouteMark({ index, total }: PersistentProps) {
  return <div className="persistent-card"><strong>RUTA DIAGONAL</strong>
    <span>{index + 1} de {total}</span></div>;
}

export function FinalMark() {
  return <div className="persistent-card"><strong>RUTA COMPLETA</strong><span>◆</span></div>;
}
