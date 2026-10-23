# Manoj Sreekumar, portfolio

Angular 21, prerendered to static HTML. Design rules and the concept live in [DESIGN.md](DESIGN.md).

## Run

```bash
npm install
npm start                 # dev server at http://localhost:4200
npm run build             # production build + 404.html → dist/redefine-portfolio/browser
npm run serve:dist        # serve that build at http://127.0.0.1:4400
npm run figure            # rebuild Fig 1 (the quantum computer) and run its geometry audit
```

## Where things live

| What | Where |
|---|---|
| All copy, projects, skills, links | `src/app/data/site.ts` |
| Project screenshots | `public/work/` |
| Pages | `src/app/pages/` (home, case, about, not-found) |
| Header, footer, focus scale, clock | `src/app/shell/` |
| Motion engine (GSAP + Lenis, page lifecycle) | `src/engine/` (Angular adapter: `angular.ts`) |
| Focus driver, iris transition, previews | `src/motion/` |
| Fig 1 source (anatomy kit) and live code | `scripts/figure/cryostat.mjs`, `src/app/figure/cryostat.ts` |
| Styles | `src/styles.scss` |

## Deploy

The build output is a static folder, `dist/redefine-portfolio/browser`. Point any static host at it,
for example Vercel (`npx vercel --prod`, output directory `dist/redefine-portfolio/browser`) or Netlify.
Unknown paths should serve `404.html` with a 404 status (both hosts do this by default).

## To confirm or replace

- `site.url` in `src/app/data/site.ts` (also `public/robots.txt`, `public/sitemap.xml`, and the
  JSON-LD in `src/index.html`) uses the existing Vercel address; change it if the new site gets a domain.
- The case study copy for Brands.io, Taste Now and Dentics is written from what the live sites show.
- The three "How I work" principles on the About page are written in your voice; edit freely.
- Screenshots in `public/work/` were taken from the live sites; swap in design files if you prefer.
