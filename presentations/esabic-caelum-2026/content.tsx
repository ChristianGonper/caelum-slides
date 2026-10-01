import React from 'react';
import type { ContentProps, PersistentProps } from '../../system/src/definition';

// Importación directa de todas las 16 imágenes locales
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
import hpmImg from './assets/images/leonidas-hpm.jpg';
import stingImg from './assets/images/sting-interceptor.jpg';

// Importación de los 3 códigos QR vectoriales ópticos locales
import qrChristianSvg from './qr/qr-christian-gonzalez.svg';
import qrAlejandroSvg from './qr/qr-alejandro-gil.svg';
import qrGuillermoSvg from './qr/qr-guillermo-alba.svg';

export const PERSISTENT_FOOTER_TEXT = 'Caelum Systems · ESA BIC CYL 2026 · 9 October 2026';
export const MISSION_SLOGAN =
  'Protecting Europe’s space ground infrastructure with disruptive sound technologies';
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
        paddingTop: '14px',
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
 * - Estado 'closing': Cierre con el claim.
 * - Estado 'contacts': Contactos y códigos QR en la misma posición.
 */
export function CenterContent({ state }: ContentProps): React.JSX.Element {
  if (state === 'closing') {
    return (
      <div className="cover-content closing-claim">
        <div className="closing-background" style={{ backgroundImage: `url(${droneDefendingImg})` }} aria-hidden="true" />
        <div className="closing-message">
          <h2>Caelum Systems</h2>
          <p className="mission-claim">{MISSION_SLOGAN}</p>
        </div>
        <div className="closing-footer"><CardFooter number="09" /></div>
      </div>
    );
  }
  if (state === 'contacts') {
    return (
      <div
        className="cover-content closing-hub"
        key="contacts"
        style={{
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px 36px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--surface), var(--background-secondary))',
          border: '2px solid var(--accent)',
        }}
      >
        {/* Fondo con imagen del dron defendiendo */}
        <div
          className="closing-background"
          style={{
            backgroundImage: `url(${droneDefendingImg})`,
          }}
          aria-hidden="true"
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              margin: '4px 0 4px',
              fontFamily: 'var(--font-title)',
              color: 'var(--heading, #e8f5f4)',
              fontSize: '28px',
              lineHeight: 1.1,
            }}
          >
            Caelum Systems
          </h2>

        </div>

        {/* Tarjetas de contacto con códigos QR vectoriales legibles ópticamente */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            position: 'relative',
            zIndex: 1,
            margin: '10px 0',
          }}
        >
          {/* Guillermo Alba Buitrón */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--surface) 88%, black)',
              border: '1px solid var(--line, #25474e)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '128px',
                height: '128px',
                padding: '4px',
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={qrGuillermoSvg}
                alt="QR LinkedIn Guillermo Alba Buitrón"
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>
            <strong style={{ display: 'block', fontSize: '14px', color: 'var(--heading)', lineHeight: 1.2 }}>
              Guillermo Alba Buitrón
            </strong>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                color: 'var(--muted)',
                margin: '3px 0 6px',
                lineHeight: 1.25,
              }}
            >
              Project management · Systems architecture · Business development
            </span>
            <a
              href="https://www.linkedin.com/in/guillermo-alba-buitron/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                color: 'var(--accent)',
                fontSize: '11px',
                fontWeight: 600,
                textDecoration: 'none',
                wordBreak: 'break-all',
              }}
            >
              LinkedIn Profile
            </a>
          </div>

          {/* Alejandro Gil Getino */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--surface) 88%, black)',
              border: '1px solid var(--line, #25474e)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '128px',
                height: '128px',
                padding: '4px',
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={qrAlejandroSvg}
                alt="QR LinkedIn Alejandro Gil Getino"
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>
            <strong style={{ display: 'block', fontSize: '14px', color: 'var(--heading)', lineHeight: 1.2 }}>
              Alejandro Gil Getino
            </strong>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                color: 'var(--muted)',
                margin: '3px 0 6px',
                lineHeight: 1.25,
              }}
            >
              Electronics · Avionics · Power systems · Control and software
            </span>
            <a
              href="https://www.linkedin.com/in/alejandro-gil-getino"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                color: 'var(--accent)',
                fontSize: '11px',
                fontWeight: 600,
                textDecoration: 'none',
                wordBreak: 'break-all',
              }}
            >
              LinkedIn Profile
            </a>
          </div>

          {/* Christian González Pérez */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'color-mix(in srgb, var(--surface) 88%, black)',
              border: '1px solid var(--line, #25474e)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '128px',
                height: '128px',
                padding: '4px',
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={qrChristianSvg}
                alt="QR LinkedIn Christian González Pérez"
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>
            <strong style={{ display: 'block', fontSize: '14px', color: 'var(--heading)', lineHeight: 1.2 }}>
              Christian González Pérez
            </strong>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                color: 'var(--muted)',
                margin: '3px 0 6px',
                lineHeight: 1.25,
              }}
            >
              Acoustics · Data analysis · Financing · Aeroelastic and structural modelling and simulation
            </span>
            <a
              href="https://www.linkedin.com/in/christiangonzalezperez/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                color: 'var(--accent)',
                fontSize: '11px',
                fontWeight: 600,
                textDecoration: 'none',
                wordBreak: 'break-all',
              }}
            >
              LinkedIn Profile
            </a>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <CardFooter number="10" />
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
        background:
          'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 18%, var(--surface)), var(--background-secondary))',
        border: '2px solid color-mix(in srgb, var(--accent) 70%, transparent)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      }}
    >

      <h2
        style={{
          margin: '4px 0 12px',
          fontFamily: 'var(--font-title)',
          fontSize: '64px',
          fontWeight: 800,
          color: 'var(--heading, #e8f5f4)',
          letterSpacing: '-0.02em',
        }}
      >
        Caelum Systems
      </h2>
      <span className="intro-product">RAR</span>
      <p
        style={{
          margin: '0 0 16px',
          fontSize: '28px',
          fontWeight: 500,
          color: 'var(--ink, #e8f5f4)',
          maxWidth: '640px',
        }}
      >
        Acoustic counter-UAS defence system
      </p>

      <span
        style={{
          fontSize: '20px',
          color: 'var(--muted, #9ab7b8)',
          letterSpacing: '0.08em',
        }}
      >
        ESA BIC 2026 · Castilla y León
      </span>
      <div className="intro-footer"><span>{PERSISTENT_FOOTER_TEXT}</span></div>
    </div>
  );
}

/**
 * Componente del Bloque A (12:00):
 * Pila multi-estado con fotografías a sangre completa (full bleed):
 * - Estado 'nuclear': Central nuclear (Slide 01)
 * - Estado 'space': Antenas de espacio profundo (Slide 02)
 */
export function BlockAContent(props: ContentProps): React.JSX.Element {
  const { state } = props;
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

  return <BlockAContent {...props} state="nuclear" />;
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
        padding: '38px 46px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        border: '2px solid var(--accent)',
      }}
    >
      <h2
        style={{
          margin: '10px 0 6px',
          fontFamily: 'var(--font-title)',
          fontSize: '34px',
          color: 'var(--heading)',
        }}
      >
        The response gap
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          fontSize: '19px',
          color: 'var(--ink)',
          fontWeight: 500,
        }}
      >
        Detecting a drone is not the same as stopping it safely
      </p>

      <div className="technical-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '26px', alignItems: 'center' }}>
        <ul role="list"
          style={{
            margin: 0,
            paddingLeft: '22px',
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--ink)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <li><em className="keyword">Detection</em> is only the first step.</li>
          <li>
            Every other option has <em className="keyword">constraints</em>:
            <ul role="list" className="technical-sublist"><li>RF / GNSS</li><li>HPM</li><li>Kinetic systems / interceptors</li></ul>
          </li>
          <li>Space infrastructure cannot simply <em className="keyword">stop operating</em>.</li>
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
            style={{ width: '100%', height: '330px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      <CardFooter number="03" />
    </div>
  );
}

/**
 * Componente del Bloque C (04:00):
 * Our solution: RAR (Slide 05)
 */
export function BlockCContent(): React.JSX.Element {
  return (
    <div
      className="slide-content"
      style={{
        height: '100%',
        boxSizing: 'border-box',
        padding: '38px 46px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        border: '2px solid var(--accent)',
      }}
    >
      <h2
        style={{
          margin: '10px 0 6px',
          fontFamily: 'var(--font-title)',
          fontSize: '34px',
          color: 'var(--heading)',
        }}
      >
        Our solution
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          fontSize: '19px',
          color: 'var(--ink)',
          fontWeight: 500,
        }}
      >
        RAR is an acoustic effector for propeller-driven UAS
      </p>

      <div className="technical-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'center' }}>
        <ul role="list"
          style={{
            margin: 0,
            paddingLeft: '22px',
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--ink)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <li>External track, <em className="keyword">targeted</em> response.</li>
          <li>Directional acoustic excitation to the propellers.</li>
          <li>Mission denial: loss of control margin or propeller damage.</li>
          <li><em className="keyword">Reusability</em>.</li>
        </ul>

        <img
          className="solution-image"
          src={droneMountingImg}
          alt="Esquema del efector RAR montado en dron"
        />
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
        padding: '38px 46px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        border: '2px solid var(--accent)',
      }}
    >
      <h2
        style={{
          margin: '10px 0 6px',
          fontFamily: 'var(--font-title)',
          fontSize: '34px',
          color: 'var(--heading)',
        }}
      >
        Built for the aerospace ground segment
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          fontSize: '19px',
          color: 'var(--ink)',
          fontWeight: 500,
        }}
      >
        An additional response option for sensitive sites
      </p>

      <div className="technical-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'center' }}>
        <ul role="list"
          style={{
            margin: 0,
            paddingLeft: '22px',
            fontSize: '16px',
            lineHeight: 1.6,
            color: 'var(--ink)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <li>
            <em className="keyword">Space connection</em>: <em className="keyword">upstream, ground systems</em>.
          </li>
          <li>
            <em className="keyword">Market</em>: space ground facilities, airports, energy infrastructure… and other <em className="keyword">critical environments</em>.
          </li>
          <li>
            <em className="keyword">Competition</em>: RF/GNSS countermeasures, interceptors, kinetic systems, lasers and high-power microwaves are alternative responses.
          </li>
        </ul>

        <div className="competition-images">
          <figure><div className="competition-crop hpm-crop"><img src={hpmImg} alt="Sistema HPM Leonidas de Epirus sobre remolque" /></div><figcaption>HPM · Epirus Leonidas</figcaption></figure>
          <figure><div className="competition-crop sting-crop"><img src={stingImg} alt="Interceptor vertical Sting de Wild Hornets" /></div><figcaption>Interceptor · Wild Hornets Sting</figcaption></figure>
        </div>
      </div>

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
        padding: '30px 40px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
        border: '2px solid var(--accent)',
        overflow: 'hidden',
      }}
    >
      <h2
        style={{
          margin: '6px 0 12px',
          fontFamily: 'var(--font-title)',
          fontSize: '30px',
          color: 'var(--heading)',
        }}
      >
        A credible route from prototype to business
      </h2>

      <div className="business-grid">
        <section><h3>Technical feasibility</h3><p>The physical principle is supported by our <em className="keyword">analytical and simulation work</em> and by published research*.</p></section>
        <section><h3>Revenue model</h3><p>Start with an evaluation or pilot. Later, sell the product, offer <em className="keyword">product maintenance</em> or a <em className="keyword">customized</em> solution.</p></section>
        <section><h3>Production strategy</h3><p>Keep knowledge and technology in-house; subcontract initial manufacturing.</p></section>
        <section><h3>Intellectual property</h3><p>Protect current models and know-how confidentially (patents).</p></section>
        <section className="risks"><h3>Risks → Solutions</h3><ol className="risk-list"><li>Unsafe acoustic exposure → Calibrated tests, exclusion zones</li><li>Unreliable target data → Measured targets, adaptive sweep</li><li aria-label="Further risks analysed">...</li></ol></section>
        <section><h3>Financing</h3><ol><li>ESA BIC incentive.</li><li><em className="keyword">Accelerators</em>: EUDIS, NATO DIANA.</li><li>Additional sources: private equity, private / public loans (NEOTEC, ENISA / SODICAL).</li></ol></section>
      </div>
      <p className="scientific-note">{SCIENTIFIC_CITATION}</p>

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
export function BlockFContent(props: ContentProps): React.JSX.Element {
  const { state } = props;
  if (state === 'team') {
    return (
      <div
        className="slide-content"
        key="team"
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '32px 42px',
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
            opacity: 0.4,
            pointerEvents: 'none',
            borderRadius: '24px',
          }}
          aria-hidden="true"
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              margin: '6px 0 2px',
              fontFamily: 'var(--font-title)',
              fontSize: '30px',
              color: 'var(--heading)',
            }}
          >
            The team behind Caelum Systems
          </h2>
          <p
            style={{
              margin: '0 0 16px',
              fontSize: '17px',
              color: 'var(--ink)',
              fontWeight: 500,
            }}
          >
            Three aerospace engineers with a vision
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* Alejandro Gil Getino */}
            <div
              style={{
                padding: '14px',
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
                style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
              />
              <strong style={{ fontSize: '15px', color: 'var(--heading)' }}>Alejandro Gil Getino</strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.35 }}>
                Electronics · Avionics · Power systems · Control and software
              </span>
            </div>

            {/* Christian González Pérez */}
            <div
              style={{
                padding: '14px',
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
                style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
              />
              <strong style={{ fontSize: '15px', color: 'var(--heading)' }}>Christian González Pérez</strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.35 }}>
                Acoustics · Data analysis · Financing · Aeroelastic and structural modelling and simulation
              </span>
            </div>

            {/* Guillermo Alba Buitrón */}
            <div
              style={{
                padding: '14px',
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
                style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
              />
              <strong style={{ fontSize: '15px', color: 'var(--heading)' }}>Guillermo Alba Buitrón</strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.35 }}>
                Project management · Systems architecture · Business development
              </span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
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
          padding: '32px 42px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          background: 'linear-gradient(140deg, var(--surface), var(--background-secondary))',
          border: '2px solid var(--accent)',
        }}
      >
        <h2
          style={{
            margin: '6px 0 2px',
            fontFamily: 'var(--font-title)',
            fontSize: '30px',
            color: 'var(--heading)',
          }}
        >
          The team behind Caelum Systems
        </h2>
        <p
          style={{
            margin: '0 0 20px',
            fontSize: '17px',
            color: 'var(--ink)',
            fontWeight: 500,
          }}
        >
          Support and institutional network
        </p>

        <div className="institution-network">
          <div><span>University of León</span><img src={uleLogo} alt="Logotipo Universidad de León" /></div>
          <div><span>INTA (National Institute of Aerospace Technology): CEAES center (Cuadros, León)</span><img src={intaLogo} alt="Logotipo INTA" /></div>
          <div><span>AEE · Spanish Space Agency</span><img src={aeeLogo} alt="Agencia Espacial Española" /></div>
          <div><span>ESA · European Space Agency</span><img src={esaLogo} alt="European Space Agency" /></div>
        </div>

        <CardFooter number="08" />
      </div>
    );
  }

  return <BlockFContent {...props} state="team" />;
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
    contacts: '10',
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
