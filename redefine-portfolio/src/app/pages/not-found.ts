import { Component, inject } from '@angular/core';
import { FocusText } from '../ui/focus-text';
import { Seo } from '../seo';

@Component({
  selector: 'app-not-found',
  imports: [FocusText],
  template: `
    <section class="nf wrap grid">
      <p class="nf__crumb mono">Out of range</p>
      <app-focus class="nf__code" tag="h1" [lines]="['404']" pin="0.18" [idle]="true" />
      <div class="nf__body">
        <p class="nf__lede">
          No definition found. This page sits closer than the lens can focus, so it will stay soft
          however long you wait.
        </p>
        <p><a class="link" href="/">Back to focus</a></p>
      </div>
    </section>
  `,
})
export class NotFound {
  constructor() {
    inject(Seo).set({
      title: 'Page not found, Manoj Sreekumar',
      description:
        'This page does not exist. Head back to the work of Manoj Sreekumar, interface designer and front-end developer.',
      path: '/404',
    });
  }
}
