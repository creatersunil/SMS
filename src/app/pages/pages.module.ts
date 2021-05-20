import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';
import { SnotifyModule, SnotifyService } from 'ng-snotify';

@NgModule({
  imports: [CommonModule, AppTranslationModule, NgaModule, routing, SnotifyModule],
  declarations: [Pages],
  providers: [SnotifyService]
})
export class PagesModule {
}
