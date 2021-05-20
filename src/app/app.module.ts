import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CustomExceptionHandler } from './services';
import { BaseHttpService} from './services';
import {DbService } from './services';
import {Logs} from './services'
/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';


import {LoggedIn }from './services';
import {UserConfig } from './services';
import {IsAccessible } from './services';
import { LoginModule } from './pages/login/login.module';

import { LoadingModule , ANIMATION_TYPES  } from 'ngx-loading';
import {MessageService} from './services';
import {SnotifyService,SnotifyModule} from 'ng-snotify';
import { ColorPickerModule } from 'ngx-color-picker';
// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    routing,
    LoginModule,
  
    LoadingModule.forRoot({
        animationType: ANIMATION_TYPES.threeBounce,
        backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
        backdropBorderRadius: '4px',
        primaryColour: '#FF5722', 
        secondaryColour: '#9C27B0', 
        tertiaryColour: '#1B5E20'
    }),
    SnotifyModule,
    ColorPickerModule,
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
  
    APP_PROVIDERS,
    CustomExceptionHandler,
    BaseHttpService,
    Logs,
    IsAccessible,
    LoggedIn,
    UserConfig,
    MessageService,
    SnotifyService
  ]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}
