import { createRoot } from 'react-dom/client';
import { esabicCaelum2026Presentation } from '../../presentations/esabic-caelum-2026/presentation';
import { prototypePresentation } from '../../presentations/prototipo-espacial/presentation';
import { diagonalPresentation } from '../../presentations/ruta-diagonal/presentation';
import { App } from './app';
import { validateDefinition } from './definition';
import { StaticDeck } from './static';

const available = [esabicCaelum2026Presentation, prototypePresentation, diagonalPresentation];
for (const definition of available) validateDefinition(definition);
const query = new URLSearchParams(window.location.search);
const requested = query.get('deck');
const selected = available.find((definition) => definition.id === requested) ?? available[0];
const staticView = query.get('view') === 'static';
document.title = `${selected.model.title}${staticView ? ' · Secuencia estática' : ''} · Caelum Slides`;

createRoot(document.getElementById('root')!).render(
  staticView ? <StaticDeck definition={selected} initialThemeId={query.get('theme') ?? undefined} /> :
    <App definition={selected} available={available} />,
);
