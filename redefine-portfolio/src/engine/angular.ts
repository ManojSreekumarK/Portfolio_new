// Angular adapter: wires the engine's four hooks to the Angular router.
//   first load            → boot(setup), once the app is stable (first route hydrated)
//   internal link click   → leave() → cleanup() → router.navigateByUrl() → render → enter()
//   back / forward        → cleanup() on NavigationStart, enter({ transition: false }) after render
// Internal links are plain <a href> (prerendered, crawlable). A capture-phase listener takes the
// click before anything else, so the transition always runs before the old page leaves the DOM.
import {
  afterNextRender,
  ApplicationRef,
  DestroyRef,
  inject,
  Injectable,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { boot, cleanup, enter, isBooted, leave, scrollToTarget } from './index';

@Injectable({ providedIn: 'root' })
export class EngineAdapter {
  private router = inject(Router);
  private injector = inject(Injector);
  private appRef = inject(ApplicationRef);
  private browser = isPlatformBrowser(inject(PLATFORM_ID));
  private busy = false;
  private popstate = false;

  /** Call once from the root component's constructor. */
  start(setup: () => void) {
    if (!this.browser) return;
    afterNextRender(
      () => {
        document.addEventListener('click', this.onClick, true);
        // Boot only once the first route has hydrated: before that, Angular may still swap the
        // prerendered nodes the engine would bind to.
        this.appRef
          .whenStable()
          .then(() => boot(setup))
          .then(() => {
            if (location.hash) this.toHash(location.hash);
          });
      },
      { injector: this.injector },
    );
    const sub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart && e.navigationTrigger === 'popstate') {
        this.popstate = true;
        cleanup();
      }
      if (e instanceof NavigationEnd && this.popstate) {
        this.popstate = false;
        this.afterRender().then(() => enter({ transition: false }));
      }
    });
    this.injector.get(DestroyRef).onDestroy(() => {
      sub.unsubscribe();
      document.removeEventListener('click', this.onClick, true);
    });
  }

  private onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    const a = (e.target as Element | null)?.closest?.('a');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const raw = a.getAttribute('href') || '';
    if (raw.startsWith('#')) {
      e.preventDefault();
      this.toHash(raw);
      return;
    }
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (url.pathname === location.pathname) {
      if (url.hash) this.toHash(url.hash);
      else scrollToTarget(0);
      return;
    }
    this.go(url.pathname + url.search, url.hash);
  };

  private async go(path: string, hash: string) {
    if (this.busy || !isBooted()) return;
    this.busy = true;
    try {
      await leave();
      cleanup();
      const ok = await this.router.navigateByUrl(path);
      if (ok) await this.afterRender();
      await enter();
      document.getElementById('main')?.focus({ preventScroll: true });
      if (hash) this.toHash(hash);
    } finally {
      this.busy = false;
    }
  }

  private toHash(hash: string) {
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    scrollToTarget(target);
    if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
  }

  // The next render after navigation, with a two-frame fallback: if the router already rendered
  // before the hook was registered, no further render may come in a zoneless app.
  private afterRender() {
    return new Promise<void>((resolve) => {
      afterNextRender(() => resolve(), { injector: this.injector });
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }
}
