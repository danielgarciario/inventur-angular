import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material/app-material.module';
import { RootStoreModule } from './root-store/root-store.module';
import { environment } from 'src/environments/environment';
import { ServicesModule } from './services/services.module';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';

import { LoginComponent } from './login/login.component';
import { LoginDetailComponent } from './login/login-detail.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SessionsModule } from './sessions/sessions.module';
import { StoreModule } from '@ngrx/store';
import { rootreducermap } from './root-store/root-store.state';
import { EffectsModule } from '@ngrx/effects';
import { ErrorEffects } from './root-store/shared/effects/error';
import { SnackbarEffects } from './root-store/shared/effects/snackbar';
import { LoginStoreEffects } from './root-store/login-store/login.effects';
import { SessionsStoreEffects } from './root-store/sessions-store/effects';
import { DeleteConfirmDialogComponent } from './shared/delete-confirm-dialog/delete-confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginDetailComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    DeleteConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RootStoreModule,
    AppRoutingModule,
    SessionsModule,
    ServicesModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    StoreModule.forRoot(rootreducermap, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true
      }
    }),
    EffectsModule.forRoot([
      ErrorEffects,
      SnackbarEffects,
      LoginStoreEffects,
      SessionsStoreEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DeleteConfirmDialogComponent]
})
export class AppModule {}
