import { Component, inject } from '@angular/core';
import { site } from '../data/site';
import { FocusText } from '../ui/focus-text';
import { Seo } from '../seo';

@Component({
  selector: 'app-about',
  imports: [FocusText],
  template: `
    <section class="about-hero wrap grid">
      <p class="about-hero__crumb mono">About</p>
      <app-focus
        class="about-hero__title"
        tag="h1"
        [lines]="['Making the other', 'side of the screen', 'look easy.']"
        [intro]="true"
        [idle]="true"
      />
      <p class="about-hero__quote mono" data-reveal="fade" data-intro data-delay="0.5">
        After a line from {{ site.quote.source }}: “{{ site.quote.text }}”
      </p>
    </section>

    <section class="about-bio wrap grid" aria-label="Biography">
      <div class="about-bio__text">
        @for (b of site.bio; track $index) {
          <p data-split="lines">{{ b }}</p>
        }
      </div>
    </section>

    <section class="skills wrap grid" aria-labelledby="skills-title">
      <app-focus class="skills__title" hid="skills-title" [lines]="['Toolkit']" />
      <dl class="skills__grid">
        @for (g of site.skills; track g.group) {
          <div data-reveal="up">
            <dt class="mono">{{ g.group }}</dt>
            <dd>{{ g.items.join(', ') }}</dd>
          </div>
        }
      </dl>
    </section>

    <section class="principles wrap grid" aria-labelledby="principles-title">
      <app-focus class="principles__title" hid="principles-title" [lines]="['How I work']" />
      <ul>
        @for (p of site.principles; track p.title) {
          <li data-reveal="up">
            <h3>{{ p.title }}</h3>
            <p>{{ p.text }}</p>
          </li>
        }
      </ul>
    </section>

    <section class="services wrap grid" aria-labelledby="services-title">
      <h2 id="services-title" class="services__title mono">What I can take on</h2>
      <ul>
        @for (s of site.services; track s) {
          <li data-reveal="up">{{ s }}</li>
        }
      </ul>
    </section>
  `,
})
export class About {
  protected site = site;

  constructor() {
    inject(Seo).set({
      title: 'About Manoj Sreekumar, web designer in Kerala',
      description:
        'Manoj Sreekumar designs websites in Figma and builds them as responsive code. His toolkit, how he works, and the freelance work he can take on.',
      path: '/about',
      type: 'profile',
    });
  }
}
