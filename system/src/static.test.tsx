import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import { StaticDeck } from './static';

describe('salida estática', () => {
  it('mantiene todas las paradas y los estados en el orden narrativo', () => {
    const html = renderToStaticMarkup(<StaticDeck definition={prototypePresentation} />);
    const pages = html.split('<article').slice(1);
    expect(pages).toHaveLength(8);
    expect(pages.map((page) => page.match(/data-stop-id="([^"]+)"/)![1]))
      .toEqual(['intro', 'block-a', 'question', 'answer', 'return', 'block-b', 'second', 'closing']);
    expect(pages[2]).toContain('data-state="question"');
    expect(pages[3]).toContain('data-state="answer"');
    expect(pages[7]).toContain('data-state="closing"');
    expect(html).not.toContain('viewer-badge');
    expect(pages.join('')).not.toContain('<button');
  });

  it('representa datos e interacción como contenido fijo con referencias SVG únicas', () => {
    const html = renderToStaticMarkup(<StaticDeck definition={diagonalPresentation} />);
    const pages = html.split('<article').slice(1);
    expect(pages).toHaveLength(7);
    expect(pages[2]).toContain('<table');
    expect(pages[5]).toContain('Tres nodos conectados por dos líneas.');
    expect(pages[5]).not.toContain('<button');
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
