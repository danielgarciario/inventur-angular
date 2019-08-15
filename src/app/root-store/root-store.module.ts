import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { EffectsModule } from '@ngrx/effects';
// import { StoreModule } from '@ngrx/store';
import { LoginStoreModule } from './login-store';
import { SessionsStoreModule } from './sessions-store/sessions-store.module';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { environment } from 'src/environments/environment';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
// import { ErrorEffects } from './shared/effects/error';
// import { SnackbarEffects } from './shared/effects/snackbar';
// import { reducerSessions } from './sessions-store/reducer';
// import { reducerlogin } from './login-store/login.reducer';
// import { LoginStoreEffects } from './login-store/login.effects';
// import { SessionsStoreEffects } from './sessions-store/effects';
// import { rootreducermap } from './root-store.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    SessionsStoreModule,
    LoginStoreModule
    // StoreDevtoolsModule.instrument({
    //   maxAge: 25,
    //   logOnly: environment.production
    // }),
    // StoreModule.forRoot({ login: reducerlogin, sesions: reducerSessions }),
    // StoreModule.forRoot(rootreducermap),
    // EffectsModule.forRoot([
    //   ErrorEffects,
    //   SnackbarEffects,
    //   LoginStoreEffects,
    //   SessionsStoreEffects
    // ])
  ]
  // ,providers: [ErrorEffects, SnackbarEffects]
})
export class RootStoreModule {}
