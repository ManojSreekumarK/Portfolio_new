import { Component } from '@angular/core';
import { positionOf } from '../../motion/scale';

const LABELS = [0.45, 0.6, 0.8, 1, 1.5, 2, 3, 5, 10, Infinity];
const MINOR = [0.5, 0.55, 0.7, 0.9, 1.2, 1.75, 2.5, 4, 7, 20];
const label = (d: number) => (d === Infinity ? '∞' : String(d));

/** The focus ring distance scale on the right edge. Driven by src/motion/scale.ts. */
@Component({
  selector: 'app-focus-scale',
  host: { class: 'fscale', 'aria-hidden': 'true' },
  template: `
    <div class="fscale__window">
      <div class="fscale__track" data-scale-track>
        @for (t of majors; track t.label) {
          <span class="fscale__tick fscale__tick--major" [style.top.%]="t.pos * 100"
            ><i>{{ t.label }}</i></span
          >
        }
        @for (t of minors; track t.pos) {
          <span class="fscale__tick" [style.top.%]="t.pos * 100"></span>
        }
      </div>
      <span class="fscale__mark"></span>
    </div>
    <span class="fscale__readout mono" data-scale-readout>0.45 m</span>
  `,
})
export class FocusScale {
  protected majors = LABELS.map((d) => ({ label: label(d), pos: positionOf(d) }));
  protected minors = MINOR.map((d) => ({ pos: positionOf(d) }));
}
