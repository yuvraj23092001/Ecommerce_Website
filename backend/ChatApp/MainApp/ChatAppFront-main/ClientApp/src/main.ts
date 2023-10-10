import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {  provideHttpClient } from "@angular/common/http";
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app.routes.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';



bootstrapApplication(AppComponent, {
   providers: [provideHttpClient(),
      importProvidersFrom(AppRoutingModule)
   ],
}).then(ref => {
   // Ensure Angular destroys itself on hot reloads.
   if (window['ngRef']) {
     window['ngRef'].destroy();
   }
   window['ngRef'] = ref;}).catch((err) => console.error(err));

  