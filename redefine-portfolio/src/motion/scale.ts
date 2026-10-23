// The focus ring scale on the right edge. Page progress is a focus distance: a real lens scale is
// linear in 1/d, so d = 0.45 m / (1 - p), and the end of every page sits at infinity.
// The loader runs the same scale from infinity down to 0.45 m, then hands the number to this readout.
import { onPage, onScroll, scrollState } from '../engine';

export const NEAR = 0.45;
export const distanceAt = (p: number) => (p >= 0.985 ? Infinity : NEAR / (1 - p));
export const formatDistance = (d: number) =>
  d === Infinity || d > 99
    ? '∞'
    : d < 1
      ? `${d.toFixed(2)} m`
      : d < 10
        ? `${d.toFixed(1)} m`
        : `${Math.round(d)} m`;
/** Where a distance sits on the scale, 0 → 1 (the inverse of distanceAt). */
export const positionOf = (d: number) => (d === Infinity ? 1 : 1 - NEAR / d);

let track: HTMLElement | null = null;
let readout: HTMLElement | null = null;
let shown = '';

export function setScale(p: number) {
  track ??= document.querySelector<HTMLElement>('[data-scale-track]');
  readout ??= document.querySelector<HTMLElement>('[data-scale-readout]');
  if (track) track.style.transform = `translate3d(0, ${(-p * 100).toFixed(3)}%, 0)`;
  const text = formatDistance(distanceAt(p));
  if (readout && text !== shown) readout.textContent = shown = text;
}

export function startScale() {
  onScroll(({ progress }) => setScale(progress));
  onPage(() => setScale(scrollState().progress));
}
