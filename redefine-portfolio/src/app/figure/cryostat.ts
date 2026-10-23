import { afterNextRender, Component, DestroyRef, ElementRef, inject, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { CRYO_MODEL as M, CRYO_P, CRYO_SVG } from './cryostat-art';
import { iso, segment, type Projection } from './iso-kit';
import { prefersReducedMotion } from '../../engine';

// Mean thermal photon number at the qubit frequency: n = 1 / (e^(hf/kT) − 1).
const photons = (T: number) => 1 / Math.expm1((6.62607015e-34 * M.FREQ) / (1.380649e-23 * T));
const fmt = (n: number) =>
  n >= 10
    ? n.toFixed(0)
    : n >= 1
      ? n.toFixed(1)
      : n >= 0.01
        ? n.toFixed(2)
        : n.toExponential(0).replace('e', 'e');
const P = CRYO_P as unknown as Projection;
const PULSE = 11; // pulse length in world units
const TOP_Z = M.TOP.z;
const END_Z = M.CHIP_Z;
// Resting places: just below each plate, then the chip.
const STOPS = M.PLATES.map((p) => p.z - 4);
STOPS[STOPS.length - 1] = END_Z;

/**
 * Fig 1, the cold stack of a quantum computer (built with the anatomy kit). A pulse travels down a coax
 * line through four plates, each colder than the last, until thermal noise at the qubit is effectively
 * zero. One clock: gsap.ticker, stopped off screen and when settled.
 */
@Component({
  selector: 'app-cryostat',
  host: { class: 'bench iso', 'data-theme': 'dark' },
  // The kit's stylesheet travels with the figure (unscoped: the SVG is injected as HTML), so it styles
  // the drawing however the app is served.
  styleUrls: ['./iso.css', './cryostat-art.css', './cryostat.css'],
  encapsulation: ViewEncapsulation.None,
  template: `
      <div
        class="iso-stage bench__stage"
        tabindex="0"
        role="slider"
        aria-label="Quantum computer cold stack. Arrow keys move the signal from plate to plate."
        aria-valuemin="0"
        aria-valuemax="3"
        aria-valuenow="3"
        [attr.aria-valuetext]="restText"
        [innerHTML]="svg"
      ></div>
  `,
})
export class Cryostat {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected svg = inject(DomSanitizer).bypassSecurityTrustHtml(CRYO_SVG); // generated at build time, ours
  protected restText = `Build, qubit at 10 mK, ${fmt(photons(0.01))} thermal photons`;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => destroy.onDestroy(this.live()));
  }

  private live() {
    const root = this.host.nativeElement;
    const stage = root.querySelector<HTMLElement>('.bench__stage')!;
    const svg = stage.querySelector('svg')!;
    const pulses = [...svg.querySelectorAll<SVGPathElement>('[data-pulse]')];
    const chip = svg.querySelector('.cry-chip');
    const atts = [...svg.querySelectorAll<SVGGElement>('[data-att]')].sort((p, q) => +p.dataset['att']! - +q.dataset['att']!);
    const steps = [...document.querySelectorAll<HTMLElement>('.stages li')];
    const calm = prefersReducedMotion();
    const [fx, fy] = M.FRONT;

    let z = calm ? END_Z : TOP_Z;
    let target = z;
    let touring = !calm;
    let clock = 0;
    let visible = false;
    let running = false;
    let idle = 0;
    let lastIndex = -2;

    // Tour: 5.5 s down the line, a 1.8 s hold on the chip, then again.
    const tourAt = (t: number) => {
      const c = t % 7.3;
      return c < 5.5 ? TOP_Z - (TOP_Z - END_Z) * (c / 5.5) : END_Z;
    };
    const levelOf = (zz: number) => M.PLATES.reduce((n, p) => (zz <= p.z ? n + 1 : n), 0) - 1; // -1: above the first plate

    const draw = () => {
      pulses.forEach((path, i) => {
        const span = M.SPANS[i];
        const a = Math.min(z + PULSE, span.z1);
        const b = Math.max(z, span.z0);
        if (a - b > 0.4) {
          path.setAttribute('d', segment([fx, fy, a], [fx, fy, b], P));
          path.style.visibility = 'visible';
        } else path.style.visibility = 'hidden';
      });
      const i = levelOf(z);
      const atChip = z <= END_Z + 0.5;
      chip?.classList.toggle('is-hit', atChip);
      // Each plate's front attenuator lights once the pulse has reached it.
      atts.forEach((g, j) => g.classList.toggle('is-on', z <= M.PLATES[j].z + 0.5));
      if (i !== lastIndex) {
        lastIndex = i;
        steps.forEach((li, j) => li.toggleAttribute('data-active', j === i));
        if (i >= 0) {
          stage.setAttribute('aria-valuenow', String(i));
          stage.setAttribute(
            'aria-valuetext',
            `${M.PLATES[i].stage}: ${M.PLATES[i].temp}, ${fmt(photons(M.PLATES[i].T))} thermal photons`,
          );
        }
      }
    };

    const tick = () => {
      const dt = Math.min(gsap.ticker.deltaRatio() / 60, 1 / 30);
      if (touring) {
        clock += dt;
        target = tourAt(clock);
        z = target;
      } else z = calm ? target : z + (target - z) * (1 - Math.exp(-dt / 0.22));
      if (Math.abs(target - z) < 0.05) z = target;
      draw();
      if (!touring && z === target) stop();
    };
    const start = () => {
      if (running || !visible) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      running = false;
      gsap.ticker.remove(tick);
    };
    const steer = (to: number) => {
      touring = false;
      target = gsap.utils.clamp(END_Z, TOP_Z, to);
      clearTimeout(idle);
      if (!calm)
        idle = window.setTimeout(
          () => ((touring = true), (clock = ((TOP_Z - z) / (TOP_Z - END_Z)) * 5.5), start()),
          3600,
        );
      start();
    };
    const nearestStop = (zz: number) =>
      STOPS.reduce((best, s, i) => (Math.abs(s - zz) < Math.abs(STOPS[best] - zz) ? i : best), 0);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible && (touring || z !== target)) start();
        else if (!visible) stop();
      },
      { rootMargin: '120px 0px' },
    );
    io.observe(stage);

    // Pointer height maps onto the line between the top flange and the chip, as drawn.
    const yTop = iso([fx, fy, TOP_Z], P)[1];
    const yEnd = iso([fx, fy, END_Z], P)[1];
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const box = svg.getBoundingClientRect();
      const y = ((e.clientY - box.top) / box.height) * M.H;
      const share = gsap.utils.clamp(0, 1, (y - yTop) / (yEnd - yTop));
      steer(TOP_Z - share * (TOP_Z - END_Z));
    };
    const onLeave = () => steer(STOPS[nearestStop(target)]);
    const onTap = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      steer(STOPS[(nearestStop(target) + 1) % STOPS.length]);
    };
    const onKey = (e: KeyboardEvent) => {
      const here = nearestStop(target);
      const to =
        e.key === 'ArrowDown' || e.key === 'ArrowRight'
          ? Math.min(3, here + 1)
          : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
            ? Math.max(0, here - 1)
            : e.key === 'Home'
              ? 0
              : e.key === 'End'
                ? 3
                : null;
      if (to === null) return;
      e.preventDefault();
      steer(STOPS[to]);
    };
    // Hovering a stage description sends the signal to that plate.
    const stepOff = steps.map((li, i) => {
      const fn = () => steer(STOPS[i]);
      li.addEventListener('pointerenter', fn);
      return () => li.removeEventListener('pointerenter', fn);
    });
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointerup', onTap);
    stage.addEventListener('keydown', onKey);
    draw();

    return () => {
      stop();
      clearTimeout(idle);
      io.disconnect();
      stepOff.forEach((f) => f());
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointerup', onTap);
      stage.removeEventListener('keydown', onKey);
    };
  }
}
