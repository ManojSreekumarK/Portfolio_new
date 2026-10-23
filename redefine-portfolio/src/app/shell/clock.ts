import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';

/** The frame's timestamp, like the date and time a camera writes into a photo (the visitor's clock). */
@Component({
  selector: 'app-clock',
  host: { class: 'exif mono' },
  template: `<span class="sr-only">Local time</span
    ><time [attr.datetime]="iso()">{{ date() }}&nbsp;&nbsp;{{ time() }}</time>`,
})
export class Clock {
  protected date = signal('-- --- ----');
  protected time = signal('--:--:--');
  protected iso = signal<string | null>(null);

  constructor() {
    const destroy = inject(DestroyRef);
    // Browser only: an interval during prerender would keep the app from ever becoming stable.
    afterNextRender(() => {
      const tick = () => {
        const now = new Date();
        this.date.set(
          now
            .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            .toUpperCase(),
        );
        this.time.set(
          now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }),
        );
        this.iso.set(now.toISOString());
      };
      tick();
      const id = setInterval(tick, 1000);
      destroy.onDestroy(() => clearInterval(id));
    });
  }
}
