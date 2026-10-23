// Case pages: a tall screenshot scrolls inside its frame while the frame crosses the viewport, so
// the visitor reads further down the live site without leaving this one.
import { gsap } from 'gsap';
import { onPage, prefersReducedMotion } from '../engine';

export const startShots = () =>
  onPage(() => {
    if (prefersReducedMotion()) return;
    document.querySelectorAll<HTMLElement>('[data-scrub-shot]').forEach((frame) => {
      const img = frame.querySelector('img');
      if (!img) return;
      gsap.to(img, {
        y: () => -Math.max(0, img.offsetHeight - frame.clientHeight),
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
  });
