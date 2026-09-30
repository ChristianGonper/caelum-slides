import React, { useId } from 'react';

/**
 * Esquema SVG vectorial central de 6 brazos para Caelum Systems (ESA BIC 2026).
 *
 * Representa una estructura de dron hexacóptero en vista cenital (blueprint técnico),
 * conectando el núcleo central (0, 0) con los 6 bloques periféricos (A a F)
 * en coordenadas de espacio mundial (world-space).
 *
 * Se ubica en el nivel de decoración del mundo (z-index 1) y se suprime en la pantalla
 * negra inicial y en paradas a sangre mediante `decorationByStop`.
 */
export function CaelumVectorSchema(): React.JSX.Element {
  const gridPatternId = useId();
  const rotorGradientId = useId();

  // Coordenadas canónicas de los 6 bloques periféricos (centros)
  const targets = [
    { id: 'A', x: 0, y: -1100, label: '12H · CONTEXT' },
    { id: 'B', x: 1150, y: -580, label: '02H · RESPONSE GAP' },
    { id: 'C', x: 1150, y: 580, label: '04H · R.A.R.' },
    { id: 'D', x: 0, y: 1100, label: '06H · SPACE MARKET' },
    { id: 'E', x: -1150, y: 580, label: '08H · BUSINESS' },
    { id: 'F', x: -1150, y: -580, label: '10H · TEAM & NETWORK' },
  ];

  const polygonPoints = targets.map((t) => `${t.x},${t.y}`).join(' ');

  return (
    <svg
      className="world-art caelum-vector-schema"
      viewBox="-2100 -1600 4200 3200"
      width="4200"
      height="3200"
      style={{
        position: 'absolute',
        left: -2100,
        top: -1600,
        width: 4200,
        height: 3200,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Retícula técnica de fondo (blueprint grid) */}
        <pattern id={gridPatternId} width="120" height="120" patternUnits="userSpaceOnUse">
          <path
            d="M 120 0 H 0 V 120"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.25"
          />
          <circle cx="0" cy="0" r="1.5" fill="var(--accent)" opacity="0.3" />
        </pattern>

        <radialGradient id={rotorGradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Capa de fondo con patrón reticular */}
      <rect
        x="-2100"
        y="-1600"
        width="4200"
        height="3200"
        fill={`url(#${gridPatternId})`}
        opacity="0.3"
      />

      {/* Anillos de referencia radial concéntricos */}
      <circle
        cx="0"
        cy="0"
        r="1288"
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="6 8"
        opacity="0.2"
      />
      <circle
        cx="0"
        cy="0"
        r="1100"
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.25"
      />
      <circle
        cx="0"
        cy="0"
        r="680"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeDasharray="8 12"
        opacity="0.15"
      />

      {/* Perímetro orbital hexagonal que enlaza los 6 bloques */}
      <polygon
        points={polygonPoints}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="10 8"
        opacity="0.3"
      />

      {/* Ejes principales con retícula de calibración */}
      <g opacity="0.35">
        <line x1="-1800" y1="0" x2="1800" y2="0" stroke="var(--border)" strokeWidth="1" />
        <line x1="0" y1="-1400" x2="0" y2="1400" stroke="var(--border)" strokeWidth="1" />
        {/* Marcas de graduación en ejes */}
        {[-1500, -1000, -500, 500, 1000, 1500].map((pos) => (
          <line
            key={`tick-x-${pos}`}
            x1={pos}
            y1="-10"
            x2={pos}
            y2="10"
            stroke="var(--accent)"
            strokeWidth="1"
          />
        ))}
        {[-1200, -800, -400, 400, 800, 1200].map((pos) => (
          <line
            key={`tick-y-${pos}`}
            x1="-10"
            y1={pos}
            x2="10"
            y2={pos}
            stroke="var(--accent)"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* 6 Brazos estructurales desde el núcleo central a cada bloque */}
      {targets.map((target) => {
        // Cálculo de vector normalizado y punto de anclaje fuera del fuselaje central
        const dist = Math.sqrt(target.x * target.x + target.y * target.y);
        const ux = target.x / dist;
        const uy = target.y / dist;
        const startR = 210;
        const sx = ux * startR;
        const sy = uy * startR;

        // Vector ortogonal para líneas auxiliares paralelas
        const px = -uy * 14;
        const py = ux * 14;

        return (
          <g key={`arm-${target.id}`} className="drone-arm">
            {/* Viga estructural central */}
            <line
              x1={sx}
              y1={sy}
              x2={target.x}
              y2={target.y}
              stroke="var(--graphic)"
              strokeWidth="2"
              opacity="0.75"
            />
            {/* Guías laterales paralelas del brazo */}
            <line
              x1={sx + px}
              y1={sy + py}
              x2={target.x + px * 0.7}
              y2={target.y + py * 0.7}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="6 6"
              opacity="0.4"
            />
            <line
              x1={sx - px}
              y1={sy - py}
              x2={target.x - px * 0.7}
              y2={target.y - py * 0.7}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="6 6"
              opacity="0.4"
            />

            {/* Nacela y rotor en la terminación de cada brazo */}
            <circle
              cx={target.x}
              cy={target.y}
              r="80"
              fill={`url(#${rotorGradientId})`}
              opacity="0.6"
            />
            <circle
              cx={target.x}
              cy={target.y}
              r="60"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <circle
              cx={target.x}
              cy={target.y}
              r="34"
              fill="none"
              stroke="var(--graphic)"
              strokeWidth="1.5"
              opacity="0.75"
            />
            <circle cx={target.x} cy={target.y} r="5" fill="var(--accent)" opacity="0.9" />

            {/* Arco de barrido de pala indicativo */}
            <path
              d={`M ${target.x - 45} ${target.y} A 45 45 0 0 1 ${target.x + 45} ${target.y}`}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.4"
            />

            {/* Etiqueta técnica minimalista */}
            <text
              x={target.x + (target.x === 0 ? 18 : target.x > 0 ? 25 : -25)}
              y={target.y + (target.y === 0 ? -18 : target.y > 0 ? 25 : -25)}
              fill="var(--accent)"
              fontSize="11"
              fontFamily="var(--font-mono, monospace)"
              letterSpacing="1.5"
              opacity="0.65"
              textAnchor={target.x < 0 ? 'end' : 'start'}
            >
              ARM-{target.id} // {target.label}
            </text>
          </g>
        );
      })}

      {/* Núcleo central del hexacóptero (Central Airframe Hub) */}
      <g className="drone-hub">
        {/* Fuselaje hexagonal interior */}
        <polygon
          points="0,-210 182,-105 182,105 0,210 -182,105 -182,-105"
          fill="none"
          stroke="var(--graphic)"
          strokeWidth="2"
          opacity="0.8"
        />
        <circle
          cx="0"
          cy="0"
          r="165"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          opacity="0.5"
        />
        <circle
          cx="0"
          cy="0"
          r="95"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <circle
          cx="0"
          cy="0"
          r="45"
          fill="none"
          stroke="var(--graphic)"
          strokeWidth="2"
          opacity="0.85"
        />
        <circle cx="0" cy="0" r="6" fill="var(--accent)" />

        {/* Retículas y marcadores de orientación */}
        <line x1="-70" y1="0" x2="-20" y2="0" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="20" y1="0" x2="70" y2="0" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="0" y1="-70" x2="0" y2="-20" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="0" y1="20" x2="0" y2="70" stroke="var(--accent)" strokeWidth="1.5" />

        {/* Metadatos técnicos de aeronavegabilidad */}
        <text
          x="0"
          y="-115"
          fill="var(--accent)"
          fontSize="10"
          fontFamily="var(--font-mono, monospace)"
          letterSpacing="2.5"
          opacity="0.7"
          textAnchor="middle"
        >
          CAELUM · HEX-AIRFRAME SCHEMA
        </text>
        <text
          x="0"
          y="130"
          fill="var(--muted, #9ab7b8)"
          fontSize="9"
          fontFamily="var(--font-mono, monospace)"
          letterSpacing="1.5"
          opacity="0.6"
          textAnchor="middle"
        >
          ROTATIONAL RADIUS: 1288 PX · 60° CHORDS
        </text>
      </g>
    </svg>
  );
}

export const Decoration = CaelumVectorSchema;
export default CaelumVectorSchema;
