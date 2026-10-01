import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { esabicCaelum2026Presentation as definition } from '../../presentations/esabic-caelum-2026/presentation';
import { resolveCanvasStop } from './navigation';
import { Scene } from './scene';
import { validateDefinition } from './definition';

const model = definition.model;
const stop = (id: string) => model.stops.find(item => item.id === id)!;

describe('persistent canvas narrative states', () => {
  it.each([
    ['opening-nuclear', 'nuclear', 'team', 'intro'],
    ['opening-space', 'space', 'team', 'intro'],
    ['response-gap', 'space', 'team', 'intro'],
    ['team', 'space', 'team', 'intro'],
    ['network', 'space', 'network', 'intro'],
    ['closing', 'space', 'network', 'closing'],
    ['contacts', 'space', 'network', 'contacts'],
  ])('resolves initial, current and final states at %s', (id, opening, team, center) => {
    const snapshot = resolveCanvasStop(model, stop(id));
    expect(snapshot.visibleIds).toEqual(model.elements.map(element => element.id));
    expect(snapshot.stateByElement).toMatchObject({ 'block-a': opening, 'block-f': team, center });
    expect(snapshot.cameraTargetId).toBe(stop(id).cameraTargetId);
  });

  it('resolves jumps and backwards navigation without mutating authored stops', () => {
    resolveCanvasStop(model, stop('contacts'));
    const before = stop('opening-nuclear');
    const snapshot = resolveCanvasStop(model, before);
    expect(snapshot.stateByElement?.['block-f']).toBe('team');
    expect(snapshot.stateByElement?.center).toBe('intro');
    expect(before.visibleIds).toEqual(['block-a']);
    expect(before.stateByElement).toEqual({ 'block-a': 'nuclear' });
    expect(resolveCanvasStop(model, stop('black'))).toBe(stop('black'));
  });

  it.each(['interactive', 'static'] as const)('renders all seven blocks in %s with the original sketch', output => {
    const html = renderToStaticMarkup(<Scene definition={definition} stop={stop('solution')}
      camera={{ x: 0, y: 0, k: 1 }} output={output} />);
    expect(html.match(/data-element-id=/g)).toHaveLength(7);
    expect(html).toContain('data-element-id="block-a" data-state="space"');
    expect(html).toContain('data-element-id="block-f" data-state="team"');
    expect(html).toContain('caelum-vector-schema');
    const empty = renderToStaticMarkup(<Scene definition={definition} stop={stop('black')}
      camera={{ x: 0, y: 0, k: 1 }} output={output} />);
    expect(empty).not.toContain('data-element-id=');
    expect(empty).not.toContain('world-decoration');
  });

  it('validates the opt-in switch', () => {
    expect(() => validateDefinition(definition)).not.toThrow();
    expect(() => validateDefinition({ ...definition,
      visual: { ...definition.visual, keepElementsVisible: 'yes' as unknown as boolean },
    })).toThrow('Configuración de visibilidad persistente inválida');
  });
});
