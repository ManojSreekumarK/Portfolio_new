import { Component, computed, inject, input, OnInit } from '@angular/core';
import { nextProject, projectBySlug, projects } from '../data/site';
import { FocusText } from '../ui/focus-text';
import { Seo } from '../seo';

@Component({
  selector: 'app-case',
  imports: [FocusText],
  template: `
    @let p = project();
    <article class="case">
      <header class="case__head wrap grid">
        <p class="case__crumb mono">
          <a class="util" href="/#work">Work</a>&ngsp;<span aria-hidden="true">/</span>&ngsp;{{
            p.kind
          }}, {{ p.year }}
        </p>
        <app-focus class="case__title" tag="h1" [lines]="[p.title]" [intro]="true" [idle]="true" />
        <p class="case__summary" data-split="lines" data-intro data-delay="0.25">{{ p.summary }}</p>
        <dl class="case__meta mono" data-reveal="fade" data-intro data-delay="0.45">
          <div>
            <dt>Type</dt>
            <dd>{{ p.kind }}, {{ p.year }}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{{ p.role.join(' and ') }}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{{ p.stack.join(', ') }}</dd>
          </div>
          <div>
            <dt>Live</dt>
            <dd>
              <a class="util" [href]="p.live" target="_blank" rel="noopener">{{ liveHost() }}</a>
            </dd>
          </div>
        </dl>
      </header>

      <figure class="case__cover wrap">
        <div class="case__plate">
          <img
            [src]="p.image.desktop"
            [alt]="p.image.alt"
            width="1440"
            height="900"
            fetchpriority="high"
            decoding="async"
          />
        </div>
        <figcaption class="mono">The live site at 1440 pixels wide.</figcaption>
      </figure>

      <div class="case__body wrap grid">
        <section class="case__block" aria-labelledby="ctx">
          <h2 id="ctx" class="case__h mono">Context</h2>
          <p class="case__lead" data-split="lines">{{ p.context }}</p>
        </section>
        <section class="case__block" aria-labelledby="idea">
          <h2 id="idea" class="case__h mono">Idea</h2>
          <p class="case__lead" data-split="lines">{{ p.idea }}</p>
        </section>
      </div>

      <div class="case__media wrap grid">
        <figure class="case__scroll" data-reveal="clip">
          <div class="case__frame" data-scrub-shot>
            <img
              [src]="p.image.scroll"
              [alt]="p.image.scrollAlt"
              width="1200"
              height="1667"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption class="mono">Further down the page.</figcaption>
        </figure>
        <figure class="case__phone" data-reveal="clip" data-delay="0.1">
          <div class="case__frame case__frame--phone">
            <img
              [src]="p.image.mobile"
              [alt]="p.image.mobileAlt"
              width="600"
              height="1298"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption class="mono">At 390 pixels, on a phone.</figcaption>
        </figure>
      </div>

      <div class="case__body wrap grid">
        <section class="case__block" aria-labelledby="craft">
          <h2 id="craft" class="case__h mono">Craft</h2>
          <ul class="craft">
            @for (c of p.craft; track c.title) {
              <li data-reveal="up">
                <h3>{{ c.title }}</h3>
                <p>{{ c.text }}</p>
              </li>
            }
          </ul>
        </section>
        <section class="case__block" aria-labelledby="out">
          <h2 id="out" class="case__h mono">Outcome</h2>
          <div class="case__lead">
            <p data-split="lines">{{ p.outcome }}</p>
            <p class="case__visit">
              <a class="link" [href]="p.live" target="_blank" rel="noopener">Visit the live site</a>
            </p>
          </div>
        </section>
      </div>

      <nav class="case__next wrap" aria-label="Next project">
        <a class="next" [href]="'/work/' + next().slug">
          <span class="next__label mono">Next project, at {{ next().distance }}</span>
          <span class="next__title">{{ next().title }}</span>
          <span class="next__shot shot" aria-hidden="true">
            <img
              class="shot__sharp"
              [src]="next().image.small"
              alt=""
              width="800"
              height="500"
              loading="lazy"
              decoding="async"
            />
            <img
              class="shot__ghost"
              [src]="next().image.small"
              alt=""
              width="800"
              height="500"
              loading="lazy"
              decoding="async"
            />
          </span>
        </a>
      </nav>
    </article>
  `,
})
export class CaseStudy implements OnInit {
  private seo = inject(Seo);
  readonly slug = input.required<string>();
  protected project = computed(() => projectBySlug(this.slug()) ?? projects[0]);
  protected next = computed(() => nextProject(this.project().slug));
  protected liveHost = computed(() => new URL(this.project().live).host);

  // The route input is bound before ngOnInit, which also runs during prerender.
  ngOnInit() {
    const p = this.project();
    this.seo.set({
      title: `${p.title}, ${p.discipline.toLowerCase()} by Manoj Sreekumar`,
      description: `${p.summary} The context, the idea and the craft details behind it.`,
      path: `/work/${p.slug}`,
      type: 'article',
    });
  }
}
