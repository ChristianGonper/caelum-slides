import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { esabicCaelum2026Presentation as definition } from '../../presentations/esabic-caelum-2026/presentation';
import { NewsClippings } from '../../presentations/esabic-caelum-2026/news';
import { changesContentInPlace } from './navigation';

describe('staggered news sequence', () => {
  it('starts all five clippings with one click from black before the flight to the center', () => {
    const start = definition.model.stops.findIndex(stop => stop.id === 'opening-space');
    expect(definition.model.stops.slice(start + 1, start + 4).map(stop => stop.id))
      .toEqual(['news-black', 'news-5', 'overview']);
    for (const count of [0, 5]) {
      const html = renderToStaticMarkup(<NewsClippings count={count} output="interactive" />);
      expect(html.match(/<article/g) ?? []).toHaveLength(count);
      expect(html.match(/clipping-enter/g) ?? []).toHaveLength(count);
    }
    const html = renderToStaticMarkup(<NewsClippings count={5} output="interactive" />);
    for (const delay of [0, 2, 4, 6, 8]) expect(html).toContain(`animation-delay:${delay}s`);
    expect(changesContentInPlace(definition.model, start + 1, start + 2, 'block-a')).toBe(true);
  });
  it('exports only the complete collage and respects the source exceptions', () => {
    const stops = definition.model.stops.filter(stop => stop.includeInStatic !== false);
    expect(stops).toHaveLength(12);
    expect(stops[2].id).toBe('news-5');
    const html = renderToStaticMarkup(<NewsClippings count={5} output="static" />);
    expect(html.match(/<img/g)).toHaveLength(3);
    expect(html).not.toContain('clipping-enter');
    expect(html).toContain('near the site’s cooling pond last week');
    expect(html).not.toContain('Update 299');
  });
});
