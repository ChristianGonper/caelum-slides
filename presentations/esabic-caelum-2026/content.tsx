import React from 'react';
import type { ContentProps, PersistentProps } from '../../system/src/definition';

// Importación directa de imágenes locales
import nuclearStationImg from './assets/images/nuclear-station.jpeg';
import twoAntennasImg from './assets/images/two-antennas-deep.jpg';
import cebrerosImg from './assets/images/Cebreros_station_pillars.jpg';
import droneMountingImg from './assets/images/drone-mounting-clean.png';
import droneDefendingImg from './assets/images/drone-defending.png';
// @ts-expect-error Vite handles uppercase .JPG at runtime, but vite/client types only specify lowercase .jpg
import teamBolasImg from './assets/images/Foto Equipazo Bolas.JPG';
import guillermoImg from './assets/images/Foto SC Guapa - Cara.jpg';
import alejandroImg from './assets/images/Alejandro_foto_perfil.jpg';
import christianImg from './assets/images/Christian-picture.jpg';
import uleLogo from './assets/images/logotipo-universidad-de-leon-01.jpg';
import intaLogo from './assets/images/intaa.jpg';
import aeeLogo from './assets/images/aee.jpg';
import esaLogo from './assets/images/ESA_Logo_pillars.jpg';

export const PERSISTENT_FOOTER_TEXT = 'Caelum Systems · ESA BIC CYL 2026';
export const MISSION_SLOGAN =
  'Protecting Europe’s space ground infrastructure with disruptive sound technologies.';
export const SCIENTIFIC_CITATION =
  '* Scientific context, conceptual study : A. I. Toropov, “Acoustic Resonance Weapons for Drone Interdiction”, Drones and Autonomous Vehicles, 2026.';

/**
 * Pie de diapositiva integrado para las tarjetas de contenido
 */
function CardFooter({ number }: { number?: string }) {
  if (!number) return null;
  return (
    <footer
      style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: '1px solid color-mix(in srgb, var(--border, #25474e) 60%, transparent)',
        fontSize: '13px',
        letterSpacing: '0.08em',
        color: 'var(--muted, #9ab7b8)',
      }}
    >
      <span>{PERSISTENT_FOOTER_TEXT}</span>
      <span
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontWeight: 700,
          color: 'var(--accent, #70e4d4)',
        }}
      >
        {number}
      </span>
    </footer>
  );
}

/**
 * Componente del Centro (Center Hub):
 * - Estado 'intro': Portada identificativa del proyecto en la revelación del mapa.
 * - Estado 'closing': Cierre con eslogan, integrantes y contactos profesionales.
 */
export function CenterContent({ state }: ContentProps): React.JSX.Element {
  if (state === 'closing') {
    return (
      <div
        className="cover-content closing-hub"
        key="closing"
        style={{
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '36px 44px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--surface), var(--background-secondary))',
          border: '2px solid var(--accent)',
        }}
      >
        {/* Fondo sutil con imagen del dron defendiendo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${droneDefendingImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}>
            CIERRE Y CONTACTO
          </span>
          <h2
            style={{
              margin: '8px 0 6px',
              fontFamily: 'var(--font-title)',
              color: 'var(--heading, #e8f5f4)',
              fontSize: '32px',
              lineHeight: 1.1,
            }}
          >
            Caelum Systems
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '16px',
              lineHeight: 1.4,
              color: 'var(--ink, #e8f5f4)',
              maxWidth: '820px',
            }}
          >
            {MISSION_SLOGAN}
          </p>
        </div>

        {/* Tarjetas de contacto de los 3 integrantes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            position: 'relative',
            zIndex: 1,
            margin: '18px 0',
          }}
        >
          {/* Guillermo Alba Buitrón */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--surface) 80%, black)',
              border: '1px solid var(--line, #25474e)',
            }}
          >
            <strong style={{ display: 'block', fontSize: '15px', color: 'var(--heading)' }}>
              Guillermo Alba Buitrón
            </strong>
            <span
              style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--muted)',
                margin: '4px 0 8px',
              }}
            >
              Project Management & Business
            </span>
            <a
              href="https://www.linkedin.com/in/guillermo-alba-buitrón-07366b254/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                color: 'var(--accent)',
                fontSize: '11px',
                textDecoration: 'none',
                wordBreak: 'break-all',
              }}
            >
              LinkedIn Profile →
            </a>
          </div>

          {/* Alejandro Gil Getino */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--surface) 80%, black)',
              border: '1px solid var(--line, #25474e)',
            }}
          >
            <strong style={{ display: 'block', fontSize: '15px', color: 'var(--heading)' }}>
              Alejandro Gil Getino
            </strong>
            <span
              style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--muted)',
                margin: '4px 0 8px',
              }}
            >
              Electronics, Avionics & Control
            </span>
            <a
              href="https://www.linkedin.com/in/alejandro-gil-getino-6b94733b8/?isSelfProfile=false"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                color: 'var(--accent)',
                fontSize: '11px',
                textDecoration: 'none',
                wordBreak: 'break-all',
              }}
            >
              LinkedIn Profile →
            </a>
          </div>

          {/* Christian González Pérez */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--surface) 80%, black)',
              border: '1px solid var(--line, #25474e)',
            }}
          >
            <strong style={{ display: 'block', fontSize: '15px', color: 'var(--heading)' }}>
              Christian González Pérez
            </strong>
            <span
              style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--muted)',
                margin: '4px 0 8px',
              }}
            >
              Acoustics & Simulation
            </span>
            <a
              href="https://www.linkedin.com/in/christiangonzalezperez/?isSelfProfile=true"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                color: 'var(--accent)',
                fontSize: '11px',
                textDecoration: 'none',
                wordBreak: 'break-all',
              }}
            >
              LinkedIn Profile →
            </a>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <CardFooter number="09" />
        </div>
      </div>
    );
  }

  // Estado 'intro' o vista general del mapa
  return (
    <div
      className="cover-content intro-hub"
      key="intro"
      style={{
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '36px 44px',
        borderRadius: '24px',
        background: 'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 18%, var(--surface)), var(--background-secondary))',
        border: '2px solid color-mix(in srgb, var(--accent) 70%, transparent)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.22em', marginBottom: '8px' }}>
        ESA BIC 2026 · CASTILLA Y LEÓN
      </span>
      <h2
        style={{
          margin: '4px 0 12px',
          fontFamily: 'var(--font-title)',
          fontSize: '44px',
          fontWeight: 800,
          color: 'var(--heading, #e8f5f4)',
          letterSpacing: '-0.02em',
        }}
      >
        Caelum Systems
      </h2>
      <p
        style={{
          margin: '0 0 16px',
          fontSize: '22px',
          fontWeight: 500,
          color: 'var(--ink, #e8f5f4)',
          maxWidth: '640px',
        }}
      >
        Acoustic counter UAS defence System
      </p>
      <span
        style={{
          fontSize: '14px',
          color: 'var(--muted, #9ab7b8)',
          letterSpacing: '0.08em',
        }}
      >
        ESA BIC 2026 · Castilla y León
      </span>
    </div>
  );
}

/**
 * Componente del Bloque A (12:00):
 * Pila multi-estado con fotografías a sangre completa (full bleed):
 * - Estado 'nuclear': Central nuclear (Slide 01)
 * - Estado 'space': Antenas de espacio profundo (Slide 02)
 */
export function BlockAContent({ state }: ContentProps): React.JSX.Element {
  if (state === 'nuclear') {
    return (
      <div
        className="slide-content full-bleed-slide"
        key="nuclear"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}
      >
        <img
          src={nuclearStationImg}
          alt="Central nuclear en operación bajo cielo despejado"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Marca persistente integrada sobre la fotografía */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 36,
            right: 36,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 18px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            fontSize: '14px',
            letterSpacing: '0.08em',
          }}
        >
          <span>{PERSISTENT_FOOTER_TEXT}</span>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: 'var(--accent, #70e4d4)' }}>
            01
          </span>
        </div>
      </div>
    );
  }

  if (state === 'space') {
    return (
      <div
        className="slide-content full-bleed-slide"
        key="space"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}
      >
        <img
          src={twoAntennasImg}
          alt="Antenas de espacio profundo orientadas hacia el cielo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Marca persistente integrada sobre la fotografía */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 36,
            right: 36,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 18px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            fontSize: '14px',
            letterSpacing: '0.08em',
          }}
        >
          <span>{PERSISTENT_FOOTER_TEXT}</span>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: 'var(--accent, #70e4d4)' }}>
            02
          </span>
        </div>
      </div>
    );
  }

  // Vista general del bloque (Overview preview)
  return (
    <div
      className="block-content"
      style={{
        height: '100%',
        boxSizing: 'border-box',
        padding: '36px 44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        borderRadius: '24px',
        border: '2px solid color-mix(in srgb, var(--accent) 50%, transparent)',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--accent)' }}>
        BLOQUE A · 12:00
      </span>
      <strong style={{ fontSize: '32px', color: 'var(--heading)', margin: '12px 0 8px' }}>
        Context
      </strong>
      <span style={{ color: 'var(--muted)', fontSize: '18px' }}>
        2 escenas apiladas · Central nuclear & Antenas
      </span>
    </div>
  );
}

/**
 * Componente del Bloque B (02:00):
 * The response gap (Slide 04)
 */
export function BlockBContent(): React.JSX.Element {
  return (
    <div
      className="slide-content"
      style={{
        height: '100%',
        boxSizing: 'border-box',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        border: '2px solid var(--accent)',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.18em' }}>
        BLOQUE B · THE RESPONSE GAP
      </span>
      <h2
        style={{
          margin: '12px 0 8px',
          fontFamily: 'var(--font-title)',
          fontSize: '36px',
          color: 'var(--heading)',
        }}
      >
        The response gap
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: '20px',
          color: 'var(--ink)',
          fontWeight: 500,
        }}
      >
        Detecting a drone is not the same as stopping it safely.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'center' }}>
        <ul
          style={{
            margin: 0,
            paddingLeft: '24px',
            fontSize: '18px',
            lineHeight: 1.7,
            color: 'var(--ink)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <li>Detection is only the first step.</li>
          <li>
            Every other option has constraints:
            <br />
            <span style={{ color: 'var(--muted)' }}>RF/GNSS, HPM, kinetic, interceptors.</span>
          </li>
          <li>Space infrastructure cannot simply stop operating.</li>
        </ul>

        <div
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid var(--line)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
          }}
        >
          <img
            src={cebrerosImg}
            alt="Antena de la estación de Cebreros"
            style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      <CardFooter number="03" />
    </div>
  );
}

/**
 * Componente del Bloque C (04:00):
 * Our solution: R.A.R. (Slide 05)
 */
export function BlockCContent(): React.JSX.Element {
  return (
    <div
      className="slide-content"
      style={{
        height: '100%',
        boxSizing: 'border-box',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        border: '2px solid var(--accent)',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.18em' }}>
        BLOQUE C · OUR SOLUTION
      </span>
      <h2
        style={{
          margin: '12px 0 8px',
          fontFamily: 'var(--font-title)',
          fontSize: '36px',
          color: 'var(--heading)',
        }}
      >
        Our solution
      </h2>
      <p
        style={{
          margin: '0 0 24px',
          fontSize: '20px',
          color: 'var(--ink)',
          fontWeight: 500,
        }}
      >
        R.A.R.: an acoustic effector for propeller-driven UAS
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'center' }}>
        <ul
          style={{
            margin: 0,
            paddingLeft: '24px',
            fontSize: '18px',
            lineHeight: 1.7,
            color: 'var(--ink)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <li>External track, targeted response.</li>
          <li>Directional acoustic excitation to the propellers.</li>
          <li>Mission denial: loss of control margin or propeller damage.</li>
          <li>Reusability.</li>
        </ul>

        <div
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid var(--line)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
          }}
        >
          <img
            src={droneMountingImg}
            alt="Esquema del efector R.A.R. montado en dron"
            style={{ width: '100%', height: '240px', objectFit: 'contain', background: 'rgba(0,0,0,0.2)', display: 'block' }}
          />
        </div>
      </div>

      <CardFooter number="04" />
    </div>
  );
}

/**
 * Componente del Bloque D (06:00):
 * Built for the aerospace ground segment (Slide 06)
 */
export function BlockDContent(): React.JSX.Element {
  return (
    <div
      className="slide-content"
      style={{
        height: '100%',
        boxSizing: 'border-box',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        border: '2px solid var(--accent)',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.18em' }}>
        BLOQUE D · SPACE APPLICATION & MARKET
      </span>
      <h2
        style={{
          margin: '12px 0 8px',
          fontFamily: 'var(--font-title)',
          fontSize: '36px',
          color: 'var(--heading)',
        }}
      >
        Built for the aerospace ground segment
      </h2>
      <p
        style={{
          margin: '0 0 28px',
          fontSize: '20px',
          color: 'var(--ink)',
          fontWeight: 500,
        }}
      >
        An additional response option for sensitive sites
      </p>

      <ul
        style={{
          margin: 0,
          paddingLeft: '24px',
          fontSize: '19px',
          lineHeight: 1.8,
          color: 'var(--ink)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          maxWidth: '920px',
        }}
      >
        <li>
          <strong>Space connection:</strong> upstream, ground systems.
        </li>
        <li>
          <strong>Market:</strong> space ground facilities, airports, energy infrastructure… and other critical environments.
        </li>
        <li>
          <strong>Competition:</strong> RF/GNSS countermeasures, interceptors, kinetic systems, lasers and high-power microwaves are alternative responses.
        </li>
      </ul>

      <CardFooter number="05" />
    </div>
  );
}

/**
 * Componente del Bloque E (08:00):
 * A credible route from prototype to business (Slide 07)
 */
export function BlockEContent(): React.JSX.Element {
  return (
    <div
      className="slide-content"
      style={{
        height: '100%',
        boxSizing: 'border-box',
        padding: '36px 44px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        border: '2px solid var(--accent)',
        overflow: 'hidden',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.18em' }}>
        BLOQUE E · BUSINESS & FEASIBILITY
      </span>
      <h2
        style={{
          margin: '8px 0 16px',
          fontFamily: 'var(--font-title)',
          fontSize: '32px',
          color: 'var(--heading)',
        }}
      >
        A credible route from prototype to business
      </h2>

      {/* Tabla de 4 cuadrantes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
            border: '1px solid var(--line)',
          }}
        >
          <strong style={{ display: 'block', fontSize: '15px', color: 'var(--accent)', marginBottom: '4px' }}>
            Technical feasibility
          </strong>
          <span style={{ fontSize: '13px', lineHeight: 1.4, color: 'var(--ink)' }}>
            The physical principle is supported by our analytical and simulation work and by published research*.
          </span>
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
            border: '1px solid var(--line)',
          }}
        >
          <strong style={{ display: 'block', fontSize: '15px', color: 'var(--accent)', marginBottom: '4px' }}>
            Revenue model
          </strong>
          <span style={{ fontSize: '13px', lineHeight: 1.4, color: 'var(--ink)' }}>
            Start with an evaluation or pilot. Later, sell the product, offer maintenance or specifically required solution.
          </span>
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
            border: '1px solid var(--line)',
          }}
        >
          <strong style={{ display: 'block', fontSize: '15px', color: 'var(--accent)', marginBottom: '4px' }}>
            Production strategy
          </strong>
          <span style={{ fontSize: '13px', lineHeight: 1.4, color: 'var(--ink)' }}>
            Keep knowledge and technology in-house; subcontract initial manufacturing.
          </span>
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
            border: '1px solid var(--line)',
          }}
        >
          <strong style={{ display: 'block', fontSize: '15px', color: 'var(--accent)', marginBottom: '4px' }}>
            Intellectual property
          </strong>
          <span style={{ fontSize: '13px', lineHeight: 1.4, color: 'var(--ink)' }}>
            Protect current models and know-how confidentially (patents).
          </span>
        </div>
      </div>

      {/* Sección de Financiación */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'color-mix(in srgb, var(--surface) 40%, transparent)',
          border: '1px solid var(--line)',
          marginBottom: '10px',
        }}
      >
        <strong style={{ display: 'block', fontSize: '14px', color: 'var(--accent)', marginBottom: '4px' }}>
          Financing
        </strong>
        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: 1.5, color: 'var(--ink)' }}>
          <li>ESA BIC incentive.</li>
          <li>Accelerators: EUDIS, NATO DIANA.</li>
          <li>Additional sources: private equity, private / public loans (NEOTEC, ENISA / SODICAL).</li>
        </ol>
      </div>

      {/* Cita científica verificada */}
      <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>
        {SCIENTIFIC_CITATION}
      </p>

      <CardFooter number="06" />
    </div>
  );
}

/**
 * Componente del Bloque F (10:00):
 * Pila multi-estado para el equipo y su red institucional:
 * - Estado 'team': Tres ingenieros y responsabilidades (Slide 08)
 * - Estado 'network': Red de apoyo institucional (Slide 09)
 */
export function BlockFContent({ state }: ContentProps): React.JSX.Element {
  if (state === 'team') {
    return (
      <div
        className="slide-content"
        key="team"
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '36px 44px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
          border: '2px solid var(--accent)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${teamBolasImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08,
            pointerEvents: 'none',
            borderRadius: '24px',
          }}
          aria-hidden="true"
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.18em' }}>
            BLOQUE F · TEAM
          </span>
          <h2
            style={{
              margin: '8px 0 4px',
              fontFamily: 'var(--font-title)',
              fontSize: '32px',
              color: 'var(--heading)',
            }}
          >
            The team behind Caelum Systems
          </h2>
          <p
            style={{
              margin: '0 0 20px',
              fontSize: '18px',
              color: 'var(--ink)',
              fontWeight: 500,
            }}
          >
            Three aerospace engineers with a vision
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
            {/* Guillermo Alba Buitrón */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'color-mix(in srgb, var(--surface) 80%, black)',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <img
                src={guillermoImg}
                alt="Guillermo Alba Buitrón"
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}
              />
              <strong style={{ fontSize: '16px', color: 'var(--heading)' }}>Guillermo Alba Buitrón</strong>
              <span style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.4 }}>
                Project management · Systems architecture · Business development
              </span>
            </div>

            {/* Alejandro Gil Getino */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'color-mix(in srgb, var(--surface) 80%, black)',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <img
                src={alejandroImg}
                alt="Alejandro Gil Getino"
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}
              />
              <strong style={{ fontSize: '16px', color: 'var(--heading)' }}>Alejandro Gil Getino</strong>
              <span style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.4 }}>
                Electronics · Avionics · Power systems · Control and software
              </span>
            </div>

            {/* Christian González Pérez */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'color-mix(in srgb, var(--surface) 80%, black)',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <img
                src={christianImg}
                alt="Christian González Pérez"
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}
              />
              <strong style={{ fontSize: '16px', color: 'var(--heading)' }}>Christian González Pérez</strong>
              <span style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.4 }}>
                Acoustics · Data analysis · Financing · Aeroelastic and structural modelling and simulation
              </span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <CardFooter number="07" />
        </div>
      </div>
    );
  }

  if (state === 'network') {
    return (
      <div
        className="slide-content"
        key="network"
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '36px 44px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
          border: '2px solid var(--accent)',
        }}
      >
        <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.18em' }}>
          BLOQUE F · NETWORK
        </span>
        <h2
          style={{
            margin: '8px 0 4px',
            fontFamily: 'var(--font-title)',
            fontSize: '32px',
            color: 'var(--heading)',
          }}
        >
          The team behind Caelum Systems
        </h2>
        <p
          style={{
            margin: '0 0 24px',
            fontSize: '18px',
            color: 'var(--ink)',
            fontWeight: 500,
          }}
        >
          Support and institutional network
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* University of León */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '14px 20px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
              border: '1px solid var(--line)',
            }}
          >
            <img
              src={uleLogo}
              alt="Logotipo Universidad de León"
              style={{ width: '140px', height: '50px', objectFit: 'contain', background: '#ffffff', padding: '4px', borderRadius: '6px' }}
            />
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>University of León.</span>
          </div>

          {/* INTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '14px 20px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
              border: '1px solid var(--line)',
            }}
          >
            <img
              src={intaLogo}
              alt="Logotipo INTA"
              style={{ width: '140px', height: '50px', objectFit: 'contain', background: '#ffffff', padding: '4px', borderRadius: '6px' }}
            />
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
              INTA (National Institute of Aerospace Technology): CEAES center (Cuadros, León).
            </span>
          </div>

          {/* ESA & Spanish Space Agency */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '14px 20px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
              border: '1px solid var(--line)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <img
                src={aeeLogo}
                alt="Agencia Espacial Española"
                style={{ width: '90px', height: '50px', objectFit: 'contain', background: '#ffffff', padding: '4px', borderRadius: '6px' }}
              />
              <img
                src={esaLogo}
                alt="European Space Agency"
                style={{ width: '90px', height: '50px', objectFit: 'contain', background: '#ffffff', padding: '4px', borderRadius: '6px' }}
              />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
              ESA and Spanish Space Agency.
            </span>
          </div>
        </div>

        <CardFooter number="08" />
      </div>
    );
  }

  // Vista general del bloque (Overview preview)
  return (
    <div
      className="block-content"
      style={{
        height: '100%',
        boxSizing: 'border-box',
        padding: '36px 44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        borderRadius: '24px',
        border: '2px solid color-mix(in srgb, var(--accent) 50%, transparent)',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--accent)' }}>
        BLOQUE F · 10:00
      </span>
      <strong style={{ fontSize: '32px', color: 'var(--heading)', margin: '12px 0 8px' }}>
        Team
      </strong>
      <span style={{ color: 'var(--muted)', fontSize: '18px' }}>
        2 escenas apiladas · Equipo & Red institucional
      </span>
    </div>
  );
}

/**
 * Indicador persistente superior para la barra de navegación espacial
 */
export function PersistentFooter({ stop }: PersistentProps): React.JSX.Element | null {
  const numbers: Record<string, string> = {
    'opening-nuclear': '01',
    'opening-space': '02',
    'response-gap': '03',
    solution: '04',
    'space-market': '05',
    business: '06',
    team: '07',
    network: '08',
    closing: '09',
  };
  const num = numbers[stop.id];
  if (!num) return null;

  return (
    <div
      className="persistent-card caelum-persistent-badge"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.65rem 0.95rem',
        border: '1px solid var(--line)',
        borderRadius: '0.6rem',
        background: 'color-mix(in srgb, var(--panel) 92%, transparent)',
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
      }}
    >
      <strong style={{ color: 'var(--accent)' }}>{PERSISTENT_FOOTER_TEXT}</strong>
      <span
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontWeight: 700,
          color: 'var(--accent)',
        }}
      >
        {num}
      </span>
    </div>
  );
}
