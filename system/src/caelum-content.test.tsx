import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { esabicCaelum2026Presentation as definition } from '../../presentations/esabic-caelum-2026/presentation';
import { Scene } from './scene';
import { changesContentInPlace } from './navigation';

const notes = fs.readFileSync('presentations/esabic-caelum-2026/Notas.md', 'utf8');
const originalSlides = notes.split(/^## \d+\s*$/m).slice(1);
const normalized = (text: string) => text.replace(/\s+/g, ' ').trim();
// Approved amendments from the meeting and subsequent presentation edits. Historical notes stay intact.
const amendments: Record<string, readonly string[]> = {
  'Detecting a drone is not the same as stopping it safely.': ['Detecting a drone is not the same as stopping it safely'],
  'R.A.R.: an acoustic effector for propeller-driven UAS': ['RAR is an acoustic effector for propeller-driven UAS'],
  'Reusability.': ['Reusable, not a "fire and forget".'],
  'Every other option has constraints: RF/GNSS, HPM, kinetic, interceptors.': ['Every other option has constraints:', 'RF / GNSS', 'HPM', 'Kinetic systems / interceptors'],
  'Space connection: upstream, ground systems.': ['Space connection: upstream, ground systems.'],
  'Start with an evaluation or pilot. Later, sell the product, offer maintenance or specifically required solution.': ['Start with an evaluation or pilot. Later, sell the product, offer product maintenance or a customized solution.'],
  'University of León.': ['University of León'],
  'INTA (National Institute of Aerospace Technology): CEAES center (Cuadros, León).': ['INTA (National Institute of Aerospace Technology): CEAES center (Cuadros, León)'],
  'ESA and Spanish Space Agency.': ['ESA · European Space Agency', 'AEE · Spanish Space Agency'],
  'Protecting Europe’s space ground infrastructure with disruptive sound technologies.': ['Protecting Europe’s space ground infrastructure with disruptive sound technologies'],
};
const sourceStopPairs = [
  [4, 'response-gap'], [5, 'solution'], [6, 'space-market'],
  [7, 'business'], [8, 'team'], [9, 'network'], [10, 'closing'],
] as const;

describe('Caelum: fidelidad a las diapositivas originales', () => {
  it('separa el claim de los QR con un cambio de estado sin vuelo de cámara', () => {
    const closingIndex = definition.model.stops.findIndex(item => item.id === 'closing');
    const contactsIndex = closingIndex + 1;
    const closing = definition.model.stops[closingIndex];
    const contacts = definition.model.stops[contactsIndex];
    expect(contacts.id).toBe('contacts');
    expect(changesContentInPlace(definition.model, closingIndex, contactsIndex, 'center')).toBe(true);
    const render = (stop: typeof closing) => renderToStaticMarkup(<Scene definition={definition}
      stop={stop} camera={{ x: 0, y: 0, k: 1 }} output="static" />);
    expect(render(closing)).toContain('mission-claim');
    expect(render(closing)).not.toContain('QR LinkedIn');
    expect(render(contacts).match(/alt="QR LinkedIn/g)).toHaveLength(3);
    expect(render(contacts)).not.toContain('mission-claim');
  });

  it('evita solapes entre los paneles de la vista general', () => {
    const elements = definition.model.elements;
    for (let i = 0; i < elements.length; i++) {
      for (const other of elements.slice(i + 1)) {
        const a = elements[i].bounds;
        const b = other.bounds;
        const overlap = a.x < b.x + b.width && a.x + a.width > b.x &&
          a.y < b.y + b.height && a.y + a.height > b.y;
        expect(overlap, `${elements[i].id} se solapa con ${other.id}`).toBe(false);
      }
    }
  });
  for (const [slide, stopId] of sourceStopPairs) {
    it(`conserva las fuentes y las modificaciones autorizadas de la diapositiva ${slide}`, () => {
      const stop = definition.model.stops.find(item => item.id === stopId)!;
      const html = renderToStaticMarkup(<Scene definition={definition} stop={stop}
        camera={{ x: 0, y: 0, k: 1 }} output="static" />);
      const text = normalized(html.replace(/<\/?(?:em|span|strong)[^>]*>/g, '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"'));
      const lines = originalSlides[slide - 1].split(/^###/m)[0].split(/\r?\n/)
        .map(normalized).filter(line => line && !line.includes('](') &&
          !/^(La imagen|De fondo|Y salimos|Sale junto|Imagen de fondo)/.test(line));
      expect(lines.length).toBeGreaterThan(1);
      for (const line of lines) for (const expected of amendments[line] ?? [line]) {
        expect(text, `Texto autorizado ausente: ${expected}`).toContain(expected);
      }
      expect(text).not.toMatch(/BLOQUE [A-F]|CIERRE Y CONTACTO/);
    });
  }

  it('muestra contenido real en la vista general y un diagrama sin retícula ni etiquetas técnicas', () => {
    const stop = definition.model.stops.find(item => item.id === 'overview')!;
    const html = renderToStaticMarkup(<Scene definition={definition} stop={stop}
      camera={{ x: 0, y: 0, k: 1 }} output="interactive" />);
    expect(html).not.toMatch(/BLOQUE [A-F]|escenas apiladas|HEX-AIRFRAME|ROTATIONAL RADIUS|ARM-[A-F]/);
    expect(html).toContain('The team behind Caelum Systems');
    expect(html).not.toContain('Guillermo Alba Buitrón · Alejandro Gil Getino · Christian González Pérez');
    expect(html).toContain('Acoustic counter-UAS defence system');
    expect(html).toContain('caelum-vector-schema');
    expect(html).not.toContain('illustrated-airframe');
    expect(html).not.toContain('r="45"');
  });
});
