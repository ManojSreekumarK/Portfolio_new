import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EngineAdapter } from '../engine/angular';
import { setupMotion } from '../motion/setup';
import { Header } from './shell/header';
import { Footer } from './shell/footer';
import { FocusScale } from './shell/focus-scale';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, FocusScale],
  templateUrl: './app.html',
})
export class App {
  constructor() {
    inject(EngineAdapter).start(setupMotion);
  }
}
