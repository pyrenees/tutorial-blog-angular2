import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { ConfigurationService } from '@plone/api';
import { AuthService } from '@plone/api';
import { PloneapiService } from '@plone/api';
import { MaterialModule } from '@angular/material';

import { ApplicationRef } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {
  routing,
  appRoutingProviders
} from './app.routes.ts';
import { BlogpostComponent } from './blogpost/blogpost.component';
import { LoginComponent } from './login/login.component';
import { MdIconRegistry } from '@angular/material';

import {
  SchemaFormModule,
  WidgetRegistry,
  DefaultWidgetRegistry
} from 'angular2-schema-form';
import { CreationComponent } from './creation/creation.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogpostComponent,
    LoginComponent,
    CreationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MaterialModule.forRoot(),
    routing,
    SchemaFormModule
  ],
  providers: [
    appRoutingProviders,
    AuthService,
    ConfigurationService,
    MdIconRegistry,
    PloneapiService,
    {provide: WidgetRegistry, useClass: DefaultWidgetRegistry}
  ],
  entryComponents: [
    AppComponent,
    CreationComponent
  ]
})
export class AppModule {
  constructor(private _appRef: ApplicationRef) { }

  ngDoBootstrap() {
    this._appRef.bootstrap(AppComponent);
  }
}
