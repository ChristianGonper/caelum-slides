import { afterEach, describe, expect, it, vi } from 'vitest';
import { bindViewportNavigation } from './viewport-interaction';

// Minimal DOM boundary: dispatch real events through the installed listeners.
class TestElement extends EventTarget {
  interactive = false;
  focus = vi.fn();
  ownerDocument = { defaultView: new EventTarget() };
  closest() { return this.interactive ? this : null; }
}

function setup() {
  vi.useFakeTimers();
  vi.stubGlobal('Element', TestElement);
  const element = new TestElement();
  const advance = vi.fn();
  const retreat = vi.fn();
  const cleanup = bindViewportNavigation(element as unknown as HTMLElement, advance, retreat);
  const send = (type: string, props = {}, target: EventTarget = element) => {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { pointerType: 'mouse', pointerId: 1, button: 0,
      clientX: 100, clientY: 100, ...props });
    target.dispatchEvent(event);
  };
  return { element, advance, retreat, cleanup, send };
}

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('gestos de navegación del lienzo', () => {
  it('avanza una vez por clic y permite clics consecutivos', () => {
    const { send, advance, element } = setup();
    for (let i = 0; i < 2; i++) {
      send('pointerdown'); send('pointerup'); send('click');
      vi.runAllTimers();
    }
    expect(advance).toHaveBeenCalledTimes(2);
    expect(element.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('no avanza al soltar Ctrl antes del clic que termina un pan', () => {
    const { send, advance } = setup();
    send('pointerdown', { ctrlKey: true });
    send('click');
    expect(advance).not.toHaveBeenCalled();
  });

  it('no avanza tras arrastrar y volver al punto inicial', () => {
    const { send, advance, element } = setup();
    send('pointerdown');
    send('pointermove', { clientX: 140 }, element.ownerDocument.defaultView);
    send('pointermove', { clientX: 100 }, element.ownerDocument.defaultView);
    send('click');
    expect(advance).not.toHaveBeenCalled();
  });

  it.each(['touch', 'pen'])('conserva los gestos de %s sin avanzar', (pointerType) => {
    const { send, advance } = setup();
    send('pointerdown', { pointerType }); send('click');
    expect(advance).not.toHaveBeenCalled();
  });

  it('respeta controles, botones secundarios y modificadores', () => {
    const { send, advance, element } = setup();
    element.interactive = true;
    send('pointerdown'); send('click');
    element.interactive = false;
    for (const props of [{ button: 2 }, { altKey: true }, { metaKey: true }, { shiftKey: true }]) {
      send('pointerdown', props); send('click', props);
    }
    send('pointerdown'); element.interactive = true; send('click');
    expect(advance).not.toHaveBeenCalled();
  });

  it.each(['pointercancel', 'blur'])('cancela el clic pendiente tras %s', (type) => {
    const { send, advance, element } = setup();
    send('pointerdown'); send(type, {}, element.ownerDocument.defaultView); send('click');
    expect(advance).not.toHaveBeenCalled();
  });

  it('retira los listeners al desmontar el visor', () => {
    const { send, advance, cleanup } = setup();
    cleanup(); send('pointerdown'); send('click');
    expect(advance).not.toHaveBeenCalled();
  });

  it('tolera el movimiento mínimo de la mano durante un clic', () => {
    const { send, advance, element } = setup();
    send('pointerdown');
    send('pointermove', { clientX: 102 }, element.ownerDocument.defaultView);
    send('click', { clientX: 102 });
    vi.runAllTimers();
    expect(advance).toHaveBeenCalledOnce();
  });

  it('respeta la cancelación de un clic desde el contenido', () => {
    const { send, advance, element } = setup();
    send('pointerdown');
    const event = new Event('click', { cancelable: true });
    Object.assign(event, { button: 0, clientX: 100, clientY: 100 });
    event.preventDefault();
    element.dispatchEvent(event);
    expect(advance).not.toHaveBeenCalled();
  });

  it('retrocede una sola vez con doble clic sin avanzar antes ni después', () => {
    const { send, advance, retreat } = setup();
    send('pointerdown'); send('click', { detail: 1 });
    vi.advanceTimersByTime(300);
    expect(advance).not.toHaveBeenCalled();
    send('pointerdown'); send('click', { detail: 2 }); send('dblclick', { detail: 2 });
    expect(retreat).toHaveBeenCalledOnce();
    vi.runAllTimers();
    expect(advance).not.toHaveBeenCalled();
  });

  it('espera 500 ms antes de avanzar con un clic simple', () => {
    const { send, advance, retreat } = setup();
    send('pointerdown'); send('click', { detail: 1 });
    vi.advanceTimersByTime(499);
    expect(advance).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(advance).toHaveBeenCalledOnce();
    expect(retreat).not.toHaveBeenCalled();
  });

  it('conserva dos clics simples que el navegador no agrupa', () => {
    const { send, advance, retreat } = setup();
    send('pointerdown'); send('click', { detail: 1 });
    send('pointerdown', { clientX: 200 }); send('click', { detail: 1, clientX: 200 });
    vi.runAllTimers();
    expect(advance).toHaveBeenCalledTimes(2);
    expect(retreat).not.toHaveBeenCalled();
  });

  it.each(['keydown', 'wheel', 'blur', 'pointercancel'])('cancela el avance pendiente al recibir %s', (type) => {
    const { send, advance, element } = setup();
    send('pointerdown'); send('click', { detail: 1 });
    send(type, {}, element.ownerDocument.defaultView);
    vi.runAllTimers();
    expect(advance).not.toHaveBeenCalled();
  });

  it('cancela un avance pendiente al desmontar o comenzar pan con Ctrl', () => {
    const { send, advance, cleanup } = setup();
    send('pointerdown'); send('click', { detail: 1 });
    send('pointerdown', { ctrlKey: true }); send('click', { detail: 2 });
    vi.runAllTimers();
    expect(advance).not.toHaveBeenCalled();
    send('pointerdown'); send('click', { detail: 1 });
    cleanup(); vi.runAllTimers();
    expect(advance).not.toHaveBeenCalled();
  });

  it.each(['touch', 'pen'])('no retrocede con doble toque de %s', (pointerType) => {
    const { send, advance, retreat } = setup();
    send('pointerdown', { pointerType }); send('click', { detail: 2 });
    vi.runAllTimers();
    expect(advance).not.toHaveBeenCalled();
    expect(retreat).not.toHaveBeenCalled();
  });
});
