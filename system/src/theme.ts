import type { CSSProperties } from 'react';

export type Theme = {
  id: string;
  label: string;
  tokens: {
    background: {
      primary: string; secondary: string; surface: string; panel: string; grid: string;
      gradientStart: string; gradientEnd: string; gradientOpacity: number;
      gradientAngle: number; gradientType: string;
      gradientRadialPosition: { x: number; y: number };
      gradientEnabled: boolean;
    };
    typography: { title: string; heading: string; subtitle: string; body: string; muted: string };
    accent: { primary: string; secondary: string; highlight: string };
    graphics: { line: string; grid: string; border: string; chart: string; progress: string };
    fonts: {
      titleFamily: string; bodyFamily: string; monoFamily: string;
      titleWeight: number; titleSize: string; lineHeight: number; letterSpacing: string;
    };
  };
};

export function validateThemes(themes: readonly Theme[], defaultThemeId: string): void {
  if (!themes.length) throw new Error('La presentación necesita al menos una paleta');
  const ids = new Set<string>();
  for (const theme of themes) {
    if (!/^[a-z][a-z0-9-]*$/.test(theme.id) || ids.has(theme.id)) {
      throw new Error(`Paleta duplicada o inválida: ${theme.id}`);
    }
    ids.add(theme.id);
    const { background, typography, accent, graphics, fonts } = theme.tokens;
    const requiredValues = [theme.label, background.primary, background.secondary,
      background.surface, background.panel, background.grid, background.gradientStart,
      background.gradientEnd, typography.title, typography.heading, typography.subtitle,
      typography.body, typography.muted, accent.primary, accent.secondary, accent.highlight,
      graphics.line, graphics.grid, graphics.border, graphics.chart, graphics.progress,
      fonts.titleFamily, fonts.bodyFamily, fonts.monoFamily, fonts.titleSize, fonts.letterSpacing];
    if (requiredValues.some((value) => typeof value !== 'string' || !value.trim()) ||
        !Number.isFinite(fonts.titleWeight) || fonts.titleWeight <= 0 ||
        !Number.isFinite(fonts.lineHeight) || fonts.lineHeight <= 0) {
      throw new Error(`Paleta incompleta: ${theme.id}`);
    }
    if (!['radial', 'linear'].includes(background.gradientType) ||
        !Number.isFinite(background.gradientOpacity) || background.gradientOpacity < 0 ||
        background.gradientOpacity > 1 || !Number.isFinite(background.gradientAngle) ||
        !Number.isFinite(background.gradientRadialPosition.x) ||
        !Number.isFinite(background.gradientRadialPosition.y)) {
      throw new Error(`Degradado inválido: ${theme.id}`);
    }
  }
  if (!ids.has(defaultThemeId)) throw new Error(`Paleta inicial inexistente: ${defaultThemeId}`);
}

export function themeVariables(theme: Theme): CSSProperties {
  const { background, typography, accent, graphics, fonts } = theme.tokens;
  const opacity = background.gradientOpacity * 100;
  const start = `color-mix(in srgb, ${background.gradientStart} ${opacity}%, transparent)`;
  const end = `color-mix(in srgb, ${background.gradientEnd} ${opacity}%, transparent)`;
  const gradient = background.gradientType === 'radial'
    ? `radial-gradient(circle at ${background.gradientRadialPosition.x}% ${background.gradientRadialPosition.y}%, ${start}, ${end} 44%, transparent 72%)`
    : `linear-gradient(${background.gradientAngle}deg, ${start}, ${end})`;
  return {
    '--background-primary': background.primary,
    '--background-secondary': background.secondary,
    '--surface': background.surface,
    '--panel': background.panel,
    '--canvas-bg': background.gradientEnabled ? `${gradient}, ${background.primary}` : background.primary,
    '--ink': typography.body,
    '--heading': typography.title,
    '--muted': typography.subtitle,
    '--accent': accent.primary,
    '--teal': accent.primary,
    '--accent-secondary': accent.secondary,
    '--highlight': accent.highlight,
    '--line': graphics.border,
    '--graphic': graphics.chart,
    '--grid': graphics.grid,
    '--progress': graphics.progress,
    '--font-title': `"${fonts.titleFamily}", ui-sans-serif, system-ui, sans-serif`,
    '--font-body': `"${fonts.bodyFamily}", ui-sans-serif, system-ui, sans-serif`,
    '--font-mono': `"${fonts.monoFamily}", ui-monospace, monospace`,
    '--title-weight': String(fonts.titleWeight),
    '--title-size': fonts.titleSize,
    '--line-height': String(fonts.lineHeight),
    '--letter-spacing': fonts.letterSpacing,
  } as CSSProperties;
}
