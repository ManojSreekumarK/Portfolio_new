import { Component, inject } from '@angular/core';
import { projects, site } from '../data/site';
import { FocusText } from '../ui/focus-text';
import { Cryostat } from '../figure/cryostat';
import { Seo } from '../seo';

@Component({
  selector: 'app-home',
  imports: [FocusText, Cryostat],
  template: `
    <section class="hero wrap grid" aria-labelledby="hero-title">
      <div class="hero__mark" aria-hidden="true">
        <img
          src="/images/M-logo-Outline.svg"
          alt=""
          width="198"
          height="164"
          data-parallax="0.08"
        />
      </div>
      <app-focus
        class="hero__name"
        tag="h1"
        hid="hero-title"
        [lines]="[site.first, site.last]"
        [intro]="true"
        [idle]="true"
      />
      <p class="hero__lede" data-split="lines" data-intro data-delay="0.35">{{ site.hero }}</p>
      <dl class="hero__meta mono" data-reveal="fade" data-intro data-delay="0.6">
        <div>
          <dt>Based in</dt>
          <dd>{{ site.location }}</dd>
        </div>
        <div>
          <dt>Practice</dt>
          <dd>Design and front end</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>Open to freelance work</dd>
        </div>
      </dl>
    </section>

    <section class="statement wrap grid" aria-labelledby="statement-title">
      <app-focus class="statement__title" hid="statement-title" [lines]="site.statementTitle" />
      <p class="statement__body" data-split="lines">{{ site.statement }}</p>
    </section>

    <section id="work" class="work wrap" aria-labelledby="work-title" tabindex="-1">
      <div class="work__head grid">
        <app-focus class="work__title" hid="work-title" [lines]="['Selected work']" />
        <p class="work__note mono">
          {{ projects.length }} concept sites, designed and built in {{ projects[0].year }}. Nearest
          first.
        </p>
      </div>
      <ol class="index" data-index>
        @for (p of projects; track p.slug) {
          <li>
            <a class="index__row" data-row [href]="'/work/' + p.slug">
              <span class="index__dist mono">{{ p.distance }}</span>
              <span class="index__title">{{ p.title }}</span>
              <span class="index__disc">{{ p.discipline }}</span>
              <span class="index__year mono">{{ p.year }}</span>
              <span class="index__thumb" aria-hidden="true"
                ><img
                  [src]="p.image.small"
                  alt=""
                  width="800"
                  height="500"
                  loading="lazy"
                  decoding="async"
              /></span>
            </a>
          </li>
        }
      </ol>
      <div class="preview" data-preview aria-hidden="true">
        @for (p of projects; track p.slug) {
          <div class="preview__item" data-preview-item>
            <div class="shot">
              <img
                class="shot__sharp"
                [src]="p.image.small"
                alt=""
                width="800"
                height="500"
                decoding="async"
              />
              <img
                class="shot__ghost"
                [src]="p.image.small"
                alt=""
                width="800"
                height="500"
                decoding="async"
              />
            </div>
            <span class="preview__label mono"
              >{{ p.title }}, {{ p.kind.toLowerCase() }}, {{ p.year }}</span
            >
          </div>
        }
      </div>
    </section>

    <section class="process wrap grid" aria-labelledby="process-title">
      <div class="process__text">
        <app-focus
          class="process__title"
          hid="process-title"
          [lines]="['How a project', 'comes into focus']"
        />
        <ol class="stages">
          @for (s of site.stages; track s.name) {
            <li data-reveal="up">
              <h3 class="stages__name">{{ s.name }}</h3>
              <p>{{ s.text }}</p>
            </li>
          }
        </ol>
      </div>
      <figure class="process__fig" data-reveal="fade" aria-label="The cold stack of a quantum computer: a signal travels down through four plates, each colder than the last, to the qubit chip.">
        @defer (on viewport) {
          <app-cryostat />
        } @placeholder {
          <div class="bench-ph" aria-hidden="true"></div>
        }
      </figure>
    </section>

    <section class="pair wrap grid" aria-labelledby="pair-title">
      <app-focus
        class="pair__title"
        hid="pair-title"
        [lines]="['One person on both', 'sides of the handoff']"
      />
      <div class="pair__body">
        <p data-split="lines">{{ site.pair }}</p>
        <p><a class="link" href="/about">How I work, and what I can take on</a></p>
      </div>
      <div class="pair__services">
        <h3 class="mono pair__label">Services</h3>
        <ul>
          @for (s of site.services; track s) {
            <li>{{ s }}</li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class Home {
  protected site = site;
  protected projects = projects;

  constructor() {
    inject(Seo).set({
      title: 'Manoj Sreekumar, web designer and front-end developer',
      description: site.description,
      path: '/',
      type: 'profile',
    });
  }
}
