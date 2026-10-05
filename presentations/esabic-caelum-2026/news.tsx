import React from 'react';
import barajas from './assets/news/barajas.jpg';
import copenhagen from './assets/news/copenhagen.jpg';
import prisons from './assets/news/prisons.jpg';

export const newsClippings = [
  {
    source: '20minutos',
    url: 'https://www.20minutos.es/noticia/5651663/0/caos-barajas-varios-drones-obligan-suspender-trafico-aereo/',
    title: 'Drone sightings halt air traffic at Barajas and divert around twenty flights',
    summary: 'The airport resumed operations after authorities ruled out further drone sightings.',
    image: barajas, alt: 'Runway at Madrid Barajas Airport', credit: 'Image: 20minutos',
  },
  {
    source: 'REUTERS',
    url: 'https://www.reuters.com/business/aerospace-defense/copenhagen-airport-halts-traffic-due-drone-sightings-police-says-2025-09-22/',
    title: 'Drone sightings halt traffic at Denmark’s Copenhagen airport, police say',
    summary: 'Flights were suspended after drones were spotted near the airport.',
    image: copenhagen, alt: 'Police officers at Copenhagen Airport', credit: 'Ritzau Scanpix / Reuters',
  },
  {
    source: 'DCD',
    url: 'https://www.datacenterdynamics.com/en/news/russian-drones-enter-into-moldovan-airspace-collides-with-comms-tower/',
    title: 'Russian drones enter into Moldovan airspace, collides with comms tower',
    summary: 'After the collision the drone exploded',
  },
  {
    source: 'El Confidencial',
    url: 'https://www.elconfidencial.com/espana/2025-01-09/detenidos-introducir-droga-drones-prisiones-1tna_4039344/',
    title: 'Guardia Civil arrests six people for smuggling drugs into four prisons using drones',
    summary: 'A mobile group took the drones to different prisons across Spain.',
    image: prisons, alt: 'Two Guardia Civil officers', credit: 'Europa Press / Archive / Guardia Civil',
  },
  {
    source: 'IAEA',
    url: 'https://www.iaea.org/newscenter/pressreleases/update-299-iaea-director-general-statement-on-situation-in-ukraine',
    paragraph: 'The IAEA team based at Ukraine’s Zaporizhzhya Nuclear Power Plant (ZNPP) has been informed of a drone attack that damaged several vehicles near the site’s cooling pond last week, Director General Rafael Mariano Grossi said today.',
  },
] as const;

/** One click starts the complete sequence. The next slide remains under presenter control. */
export function NewsClippings({ count, output }: { count: number; output?: 'interactive' | 'static' }) {
  return <section className="news-collage" lang="en" aria-label="News clippings about drone incidents">
    {newsClippings.slice(0, count).map((item, index) => <article
      key={item.source}
      className={`news-clipping clipping-${index + 1}${output !== 'static' ? ' clipping-enter' : ''}`}
      style={output !== 'static' ? { animationDelay: `${index * 2}s` } : undefined}>
      <header><a href={item.url} target="_blank" rel="noopener noreferrer">{item.source}</a></header>
      {'paragraph' in item ? <p className="news-paragraph">{item.paragraph}</p> : <>
        <h2>{item.title}</h2>
        <p className="news-summary">{item.summary}</p>
        {'image' in item && <figure><img src={item.image} alt={item.alt} /><figcaption>{item.credit}</figcaption></figure>}
      </>}
    </article>)}
  </section>;
}
