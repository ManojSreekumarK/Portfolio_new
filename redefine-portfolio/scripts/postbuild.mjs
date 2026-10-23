// After `ng build`: give static hosts a real 404 page.
// The '404' route is prerendered to browser/404/index.html; hosts (Netlify, Vercel, GitHub Pages,
// Cloudflare Pages) serve /404.html with a 404 status for unknown paths.
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('dist/redefine-portfolio/browser');
const src = path.join(out, '404', 'index.html');
if (!fs.existsSync(src)) {
  console.error(`postbuild: ${src} is missing; is the 404 route prerendered?`);
  process.exit(1);
}
fs.copyFileSync(src, path.join(out, '404.html'));
console.log('postbuild: wrote 404.html');
