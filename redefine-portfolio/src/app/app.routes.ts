import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { CaseStudy } from './pages/case';
import { About } from './pages/about';
import { NotFound } from './pages/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'work/:slug', component: CaseStudy },
  { path: '404', component: NotFound },
  { path: '**', component: NotFound },
];
