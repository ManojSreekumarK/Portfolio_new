// Global motion, registered once before boot() runs its first page.
import { gsap } from 'gsap';
import { ease, onPage, onScroll, prefersReducedMotion, scrollState } from '../engine';
import { startFocus } from './focus';
import { startIris } from './iris';
import { setScale, startScale } from './scale';
import { startPreview } from './preview';
import { startFill } from './fill';
import { startShots } from './shots';

export function setupMotion() {
  startIris();
  startScale();
  startFocus();
  startPreview();
  startFill();
  startShots();
  startFrame();
  startRackFocus();
}

// First load, no loader: the hero name is real HTML text from the first paint. As the intro pulls it
// into focus, the focus scale racks from infinity down to the name at 0.45 m.
function startRackFocus() {
  let first = true;
  onPage(({ intro }) => {
    if (!first || prefersReducedMotion()) return;
    first = false;
    const lens = { p: 1 };
    setScale(1);
    intro.add(
      gsap.to(lens, {
        p: () => scrollState().progress,
        duration: 1.5,
        ease: ease.out,
        onUpdate: () => setScale(lens.p),
      }),
      0,
    );
  });
}

// Fixed corner UI steps aside while reading downwards and returns on the way back up; a scrim
// appears behind the top frame once the page has moved, so the nav never sits on running text.
function startFrame() {
  let last = 0;
  onScroll(({ y }) => {
    const h = document.documentElement.classList;
    h.toggle('is-scrolled', y > 40);
    if (Math.abs(y - last) < 4) return;
    h.toggle('frame-away', y > 160 && y > last);
    last = y;
  });
}
