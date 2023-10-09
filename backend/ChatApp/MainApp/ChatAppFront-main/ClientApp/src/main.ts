import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {  provideHttpClient } from "@angular/common/http";
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app.routes.module';



bootstrapApplication(AppComponent, {
   providers: [provideHttpClient(),
      importProvidersFrom(AppRoutingModule)
   ],
}).catch((err) => console.error(err));
