import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  switchMap,
  map,
  tap,
  distinctUntilChanged,
  exhaustMap
} from 'rxjs/operators';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material';

import * as fromLogin from './login.actions';
import { isUndefined } from 'util';

@Injectable()
export class LoginStoreEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private loginservice: LoginService,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  tryloginEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromLogin.Trylogin),
      switchMap((accion) =>
        this.loginservice.trylogin(accion.username, accion.password).pipe(
          tap((usr) => this.loginservice.saveTheToken(usr)),
          map((usr) => {
            if (isUndefined(usr)) {
              return fromLogin.Loginfail({ error: null });
            }
            if (usr.emno.length === 0) {
              return fromLogin.Loginfail({ error: null });
            }
            return fromLogin.Loginsuccess({ usuario: usr });
          }),
          catchError((rror) => of(fromLogin.Loginfail({ error: rror })))
        )
      )
    )
  );
  @Effect()
  tryTokenEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromLogin.Trytoken),
      tap((accion) => console.log('Intentando leer el token')),
      switchMap((accion) =>
        this.loginservice.tryToken().pipe(
          tap((usr) => this.loginservice.guardaAutorizacion(usr)),
          map((usr) => fromLogin.LoginfromTokensuccess({ usuario: usr })),
          catchError((rror) => of(fromLogin.TokenTryFailed()))
        )
      )
    )
  );
  @Effect({ dispatch: false })
  loginSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Loginsuccess),
        tap((_) => this.router.navigate(['/sessions']))
      ),
    { dispatch: false }
  );
  @Effect({ dispatch: false })
  loginSuccessFromToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.LoginfromTokensuccess),
        tap((_) => this.router.navigate(['/sessions']))
      ),
    { dispatch: false }
  );

  @Effect({ dispatch: false })
  loginFailEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Loginfail),
        tap((_) => this.loginservice.deleteToken()),
        tap((_) =>
          this.snackBar.open('Anwender und Passwort nicht bekant!!', null, {
            duration: 5000
          })
        )
      ),
    { dispatch: false }
  );
  @Effect({ dispatch: false })
  TokenTryFailedEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.TokenTryFailed),
        tap((_) => this.loginservice.deleteToken()),
        tap((_) => console.log('Ahora Routing to Login')),
        tap((_) => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );
  @Effect({ dispatch: false })
  LogoutEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Logout),
        tap((_) => this.loginservice.deleteToken()),
        tap((_) => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );
}
