// Work index: a screenshot preview follows the pointer and pulls focus each time a new row is
// entered. Keyboard focus shows the same preview beside the row. Touch rows show inline thumbnails.
import { gsap } from 'gsap';
import { ease, isTouch, onPage, onScroll, prefersReducedMotion } from '../engine';

export const startPreview = () =>
  onPage(() => {
    const list = document.querySelector<HTMLElement>('[data-index]');
    const box = document.querySelector<HTMLElement>('[data-preview]');
    if (!list || !box || isTouch()) return;
    const reduced = prefersReducedMotion();
    const items = [...box.querySelectorAll<HTMLElement>('[data-preview-item]')];
    const rows = [...list.querySelectorAll<HTMLAnchorElement>('a[data-row]')];
    const x = gsap.quickTo(box, 'x', { duration: reduced ? 0 : 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(box, 'y', { duration: reduced ? 0 : 0.6, ease: 'power3.out' });
    const rot = gsap.quickTo(box, 'rotate', { duration: 0.8, ease: 'power3.out' });
    let active = -1;
    let open = false;
    let lastX = 0;
    let px = -1;
    let py = -1;

    const show = (i: number) => {
      if (!open) {
        open = true;
        gsap.to(box, {
          autoAlpha: 1,
          scale: 1,
          duration: reduced ? 0.01 : 0.5,
          ease: ease.out,
          overwrite: 'auto',
        });
      }
      if (i === active) return;
      active = i;
      items.forEach((el, j) => gsap.set(el, { autoAlpha: j === i ? 1 : 0 }));
      if (reduced) return;
      const item = items[i];
      // The pull: the screenshot arrives soft and settles sharp, like a lens finding a new subject.
      gsap.fromTo(
        item.querySelector('.shot__ghost'),
        { opacity: 1, scale: 1.08 },
        { opacity: 0.08, scale: 1, duration: 1.1, ease: ease.out, overwrite: true },
      );
      gsap.fromTo(
        item.querySelector('.shot__sharp'),
        { opacity: 0.15, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 1.1, ease: ease.out, overwrite: true },
      );
    };
    const hide = () => {
      if (!open) return;
      open = false;
      active = -1;
      gsap.to(box, {
        autoAlpha: 0,
        scale: 0.9,
        duration: reduced ? 0.01 : 0.4,
        ease: ease.out,
        overwrite: 'auto',
      });
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      x(px);
      y(py);
      if (!reduced) rot(gsap.utils.clamp(-8, 8, (px - lastX) * 0.5));
      lastX = px;
    };
    const enters = rows.map((row, i) => {
      const onEnter = () => show(i);
      const onFocus = () => {
        if (!row.matches(':focus-visible')) return;
        const r = row.getBoundingClientRect();
        x(r.left + r.width * 0.72);
        y(r.top + r.height / 2);
        show(i);
      };
      row.addEventListener('pointerenter', onEnter);
      row.addEventListener('focus', onFocus);
      row.addEventListener('blur', hide);
      return () => {
        row.removeEventListener('pointerenter', onEnter);
        row.removeEventListener('focus', onFocus);
        row.removeEventListener('blur', hide);
      };
    });
    list.addEventListener('pointerleave', hide);
    addEventListener('pointermove', move, { passive: true });
    // pointerleave never fires when the page scrolls out from under a still pointer: check on scroll.
    const off = onScroll(() => {
      if (open && px >= 0 && !list.contains(document.elementFromPoint(px, py))) hide();
    });
    return () => {
      enters.forEach((f) => f());
      list.removeEventListener('pointerleave', hide);
      removeEventListener('pointermove', move);
      off();
    };
  });
