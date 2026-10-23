import { Component } from '@angular/core';
import { site } from '../data/site';
import { FocusText } from '../ui/focus-text';

@Component({
  selector: 'app-footer',
  imports: [FocusText],
  host: { class: 'footer', id: 'contact', tabindex: '-1' },
  template: `
    <div class="footer__top wrap grid">
      <p class="footer__at mono">At infinity</p>
      <app-focus class="footer__title" [lines]="['Bring me the', 'blurry version.']" />
      <div class="footer__cta">
        <p class="footer__lede">
          Taking on freelance projects now. Send the half-formed idea, the screenshot you hate, or
          the brief that does not make sense yet.
        </p>
        <a class="btn" data-fill [href]="'mailto:' + site.email">
          <span class="btn__fill" aria-hidden="true"></span>
          <span class="btn__label">Email me</span>
          <span class="btn__addr mono">{{ site.email }}</span>
        </a>
      </div>
    </div>
    <div class="footer__sign" aria-hidden="true">{{ site.last }}</div>
    <div class="footer__base wrap">
      <p>&copy; {{ year }} {{ site.name }}, {{ site.location }}</p>
      <ul class="footer__links">
        @for (s of site.socials; track s.href) {
          <li>
            <a class="util" [href]="s.href" target="_blank" rel="noopener">{{ s.label }}</a>
          </li>
        }
        <li><a class="util" [href]="'mailto:' + site.email">Email</a></li>
      </ul>
      <p class="footer__colophon">
        Set in Orbitron, Space Grotesk and Space Mono. Built with Angular and GSAP.
      </p>
    </div>
  `,
})
export class Footer {
  protected site = site;
  protected year = new Date().getFullYear();
}
