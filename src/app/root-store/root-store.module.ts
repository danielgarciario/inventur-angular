import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoginStoreModule } from './login-store';
import { SessionsStoreModule } from './sessions-store/sessions-store.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    MatDialogModule,
    MatSnackBarModule,
    CommonModule,
    LoginStoreModule,
    SessionsStoreModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ]
})
export class RootStoreModule {}
