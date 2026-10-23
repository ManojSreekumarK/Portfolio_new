// Page transition: an aperture iris. Six blades close to black around the point you clicked,
// the route swaps in the dark, and the iris reopens from the centre of the new page.
// Markup lives in the app shell: #curtain > svg.iris, a mask whose hexagon is the opening, plus a
// hairline hexagon that lights the blade edge. Hexagons sit in <g data-iris-at> groups (translated
// here with setAttribute); GSAP only scales and turns the hexagons themselves.
import { gsap } from 'gsap';
import { ease, setTransition } from '../engine';

let point = { x: 0, y: 0 };

function hexPoints(r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(' ');
}

function fit(svg: SVGSVGElement, x: number, y: number) {
  const w = innerWidth;
  const h = innerHeight;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  // Open = the hexagon's inner radius clears the farthest corner from (x, y).
  const far = Math.max(
    Math.hypot(x, y),
    Math.hypot(w - x, y),
    Math.hypot(x, h - y),
    Math.hypot(w - x, h - y),
  );
  const r = (far / Math.cos(Math.PI / 6)) * 1.04;
  svg.querySelectorAll('[data-iris-hex]').forEach((p) => p.setAttribute('points', hexPoints(r)));
  svg
    .querySelectorAll('[data-iris-at]')
    .forEach((g) => g.setAttribute('transform', `translate(${x} ${y})`));
  return svg.querySelectorAll('[data-iris-hex]');
}

export function startIris() {
  addEventListener('pointerdown', (e) => (point = { x: e.clientX, y: e.clientY }), {
    passive: true,
  });
  setTransition({
    leave: (c) => {
      const svg = c.querySelector<SVGSVGElement>('svg.iris')!;
      const x = point.x || innerWidth / 2;
      const y = point.y || innerHeight / 2;
      const blades = fit(svg, x, y);
      return gsap
        .timeline()
        .set(c, { autoAlpha: 1 })
        .fromTo(
          blades,
          { scale: 1, rotation: 0, svgOrigin: '0 0' },
          { scale: 0, rotation: 60, svgOrigin: '0 0', duration: 0.8, ease: ease.inOut },
        );
    },
    enter: (c) => {
      const svg = c.querySelector<SVGSVGElement>('svg.iris')!;
      const blades = fit(svg, innerWidth / 2, innerHeight / 2);
      point = { x: 0, y: 0 };
      return gsap
        .timeline()
        .fromTo(
          blades,
          { scale: 0, rotation: -60, svgOrigin: '0 0' },
          { scale: 1, rotation: 0, svgOrigin: '0 0', duration: 0.9, ease: ease.inOut },
        )
        .set(c, { autoAlpha: 0 });
    },
  });
}
