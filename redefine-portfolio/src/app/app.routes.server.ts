import { RenderMode, ServerRoute } from '@angular/ssr';
import { projects } from './data/site';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  {
    path: 'work/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => projects.map((p) => ({ slug: p.slug })),
  },
  // Prerendered once and copied to /404.html after the build (scripts/postbuild.mjs).
  { path: '404', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
