import React from 'react';
import { createRoot } from 'react-dom/client';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import { App } from './app';
import { validateDefinition } from './definition';

const available = [prototypePresentation, diagonalPresentation];
for (const definition of available) validateDefinition(definition);
const requested = new URLSearchParams(window.location.search).get('deck');
const selected = available.find((definition) => definition.id === requested) ?? available[0];
document.title = `${selected.model.title} · Caelum Slides`;

createRoot(document.getElementById('root')!).render(
  <App definition={selected} available={available} />,
);
