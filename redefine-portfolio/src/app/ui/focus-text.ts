import { Component, input } from '@angular/core';

/**
 * A display line that can be pulled into focus (src/motion/focus.ts).
 * Renders the real text once (h1, h2 or p) and a blurred ghost copy beside it, aria-hidden and
 * outside the heading, so screen readers and crawlers read the text once.
 */
@Component({
  selector: 'app-focus',
  host: {
    class: 'focus',
    'data-focus': '',
    '[attr.data-focus-intro]': 'intro() ? "" : null',
    '[attr.data-focus-idle]': 'idle() ? "" : null',
    '[attr.data-focus-pin]': 'pin()',
  },
  template: `
    @switch (tag()) {
      @case ('h1') {
        <h1 class="focus__sharp" [attr.id]="hid()">
          @for (l of lines(); track $index) {
            <span class="focus__line">{{ l }}</span>
            @if (!$last) {
              &ngsp;
            }
          }
        </h1>
      }
      @case ('h2') {
        <h2 class="focus__sharp" [attr.id]="hid()">
          @for (l of lines(); track $index) {
            <span class="focus__line">{{ l }}</span>
            @if (!$last) {
              &ngsp;
            }
          }
        </h2>
      }
      @default {
        <p class="focus__sharp" [attr.id]="hid()">
          @for (l of lines(); track $index) {
            <span class="focus__line">{{ l }}</span>
            @if (!$last) {
              &ngsp;
            }
          }
        </p>
      }
    }
    <!-- The ghost draws its text with CSS content: decorative, never read, never contrast-checked. -->
    <div class="focus__ghost" aria-hidden="true">
      @for (l of lines(); track $index) {
        <span class="focus__line" [attr.data-t]="l"></span>
      }
    </div>
  `,
})
export class FocusText {
  readonly lines = input.required<string[]>();
  readonly tag = input<'h1' | 'h2' | 'p'>('h2');
  readonly hid = input<string | null>(null);
  readonly intro = input(false);
  readonly idle = input(false);
  readonly pin = input<string | null>(null);
}
