import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { site } from './data/site';

type Page = {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
};

/** Title, description, canonical, Open Graph and Twitter tags for one page (runs at prerender). */
@Injectable({ providedIn: 'root' })
export class Seo {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  set({ title, description, path, type = 'website' }: Page) {
    const url = new URL(path, site.url).href;
    const image = new URL('/og.png', site.url).href;
    this.title.setTitle(title);
    const tags: [string, string, string][] = [
      ['name', 'description', description],
      ['property', 'og:title', title],
      ['property', 'og:description', description],
      ['property', 'og:type', type],
      ['property', 'og:url', url],
      ['property', 'og:image', image],
      ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '630'],
      ['property', 'og:site_name', site.name],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', title],
      ['name', 'twitter:description', description],
      ['name', 'twitter:image', image],
    ];
    for (const [attr, key, content] of tags)
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
