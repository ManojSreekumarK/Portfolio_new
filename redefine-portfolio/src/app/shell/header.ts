import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { Clock } from './clock';

@Component({
  selector: 'app-header',
  imports: [Clock],
  host: { class: 'frame-top' },
  template: `
    <div class="frame-top__left">
      <a
        class="brand"
        href="/"
        [attr.aria-current]="here() === 'home' ? 'page' : null"
        aria-label="Manoj Sreekumar, home"
      >
        <img src="/images/M-logo.svg" alt="" width="40" height="33" />
        <span class="brand__name" aria-hidden="true">Manoj Sreekumar</span>
      </a>
      <app-clock />
    </div>
    <nav class="nav" aria-label="Main">
      <ul>
        @for (l of links; track l.href) {
          <li>
            <a class="roll" [href]="l.href" [attr.aria-current]="here() === l.key ? 'page' : null">
              <span>{{ l.label }}</span
              ><span aria-hidden="true">{{ l.label }}</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class Header {
  private router = inject(Router);
  private url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected here = computed(() => {
    const u = this.url().split('#')[0];
    if (u.startsWith('/work')) return 'work';
    if (u.startsWith('/about')) return 'about';
    return u === '/' || u === '' ? 'home' : 'other';
  });
  protected links = [
    { key: 'work', label: 'Work', href: '/#work' },
    { key: 'about', label: 'About', href: '/about' },
    { key: 'contact', label: 'Contact', href: '#contact' },
  ];
}
