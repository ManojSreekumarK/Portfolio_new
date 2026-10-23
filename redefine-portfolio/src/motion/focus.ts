// The focus driver: one rule decides how sharp every display heading is.
// Each [data-focus] block holds a sharp layer (.focus__sharp, the real text) and a pre-blurred
// ghost (.focus__ghost, aria-hidden). Sharpness f (0 soft, 1 sharp) comes from the block's distance
// to the focal band in the middle of the viewport, capped by its intro "pull", and for the hero
// lowered by autofocus hunting (pointer speed) plus a slow breath. Only opacity and transform are
// written, so nothing re-rasterises the blur.
//   data-focus            take part
//   data-focus-intro      start soft and pull into focus with the page intro
//   data-focus-idle       hunt and breathe (the hero name)
//   data-focus-pin="0.3"  hold a fixed sharpness (the 404 never resolves)
import { gsap } from 'gsap';
import { isTouch, onPage, onScroll, prefersReducedMotion } from '../engine';

type Item = {
  el: HTMLElement;
  sharp: HTMLElement;
  ghost: HTMLElement;
  pull: number;
  pin: number | null;
  idle: boolean;
  last: number;
};

let items: Item[] = [];
const hunt = { v: 0, aim: 0 };

const clamp = gsap.utils.clamp(0, 1);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function apply(it: Item, f: number) {
  if (Math.abs(f - it.last) < 0.002) return;
  it.last = f;
  const soft = 1 - f;
  it.ghost.style.opacity = (0.1 + soft * 0.75).toFixed(3);
  it.ghost.style.transform = `scale(${(1 + soft * 0.045).toFixed(4)})`;
  it.sharp.style.opacity = (0.42 + f * 0.58).toFixed(3);
  it.sharp.style.transform = `scale(${(1 + soft * 0.02).toFixed(4)})`; // focus breathing
}

function tick(time: number) {
  if (!items.length) return;
  const r = gsap.ticker.deltaRatio();
  hunt.v += (hunt.aim - hunt.v) * (1 - Math.pow(hunt.aim > hunt.v ? 0.7 : 0.94, r));
  hunt.aim *= Math.pow(0.9, r);
  const vh = innerHeight;
  for (const it of items) {
    const b = it.el.getBoundingClientRect();
    if (b.bottom < -80 || b.top > vh + 80) continue;
    let f: number;
    if (it.pin !== null) f = it.pin;
    else {
      const d = Math.abs(b.top + b.height / 2 - vh * 0.5) / (vh * 0.5);
      f = 1 - smooth(0.4, 1.2, d);
    }
    f = Math.min(f, it.pull);
    // Autofocus hunting on pointer speed, plus a slow breath so the name never freezes.
    if (it.idle) f = clamp(f - hunt.v - (0.5 + 0.5 * Math.sin(time * 0.9)) * 0.1);
    apply(it, f);
  }
}

export function startFocus() {
  if (prefersReducedMotion()) return; // CSS holds every block sharp with a faint ghost
  let lx = 0,
    ly = 0,
    lt = 0;
  if (isTouch()) {
    onScroll(({ velocity }) => {
      hunt.aim = Math.max(hunt.aim, Math.min(0.3, Math.abs(velocity) / 120));
    });
  } else {
    addEventListener(
      'pointermove',
      (e) => {
        const now = performance.now();
        const dt = Math.max(16, now - lt);
        const speed = Math.hypot(e.clientX - lx, e.clientY - ly) / dt; // px per ms
        lx = e.clientX;
        ly = e.clientY;
        lt = now;
        hunt.aim = Math.max(hunt.aim, Math.min(0.32, speed * 0.09));
      },
      { passive: true },
    );
  }
  gsap.ticker.add(tick);

  onPage(({ intro }) => {
    items = [...document.querySelectorAll<HTMLElement>('[data-focus]')].flatMap((el) => {
      const sharp = el.querySelector<HTMLElement>('.focus__sharp');
      const ghost = el.querySelector<HTMLElement>('.focus__ghost');
      if (!sharp || !ghost) return [];
      const pin = el.dataset['focusPin'];
      return [
        {
          el,
          sharp,
          ghost,
          pull: el.hasAttribute('data-focus-intro') ? 0 : 1,
          pin: pin ? parseFloat(pin) : null,
          idle: el.hasAttribute('data-focus-idle'),
          last: -1,
        },
      ];
    });
    for (const it of items) {
      if (it.pull === 0) {
        // The pull: a short search (dip soft, then gain), then a lock, like contrast-detect AF.
        intro.add(
          gsap
            .timeline()
            .set(it, { pull: 0.55 })
            .to(it, { pull: 0.4, duration: 0.2, ease: 'power1.inOut' })
            .to(it, { pull: 1, duration: 0.9, ease: 'expo.out' }),
          0,
        );
      }
    }
    tick(gsap.ticker.time);
    return () => {
      items = [];
    };
  });
}
