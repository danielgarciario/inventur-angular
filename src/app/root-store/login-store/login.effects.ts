import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import {
  catchError,
  concatMap,
  switchMap,
  map,
  tap,
  distinctUntilChanged,
  exhaustMap,
  mergeMap,
  skip,
  takeUntil,
  debounceTime
} from 'rxjs/operators';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material';

import * as fromLogin from './login.actions';
import { isUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../shared/actions/error';

@Injectable({ providedIn: 'root' })
export class LoginStoreEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private loginservice: LoginService,
    private snackBar: MatSnackBar
  ) {
    console.log('LoginStoreEffects Constructor');
  }

  @Effect()
  tryloginEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromLogin.Trylogin),
      exhaustMap((accion) =>
        this.loginservice.trylogin(accion.username, accion.password).pipe(
          map((usr) => {
            if (usr === null) {
              return fromLogin.NormalLoginFail();
            }
            this.loginservice.saveTheToken(usr);
            return fromLogin.Loginsuccess({ usuario: usr });
          }),
          catchError((rror) => of(fromLogin.Loginfail({ error: rror })))
        )
      )
    )
  );
  /* @Effect()
  tryTokenEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromLogin.Trytoken),
      tap((accion) => console.log('Intentando leer usuario desde el token')),
      exhaustMap((accion) =>
        this.loginservice.tryToken().pipe(
          tap((usr) => this.loginservice.guardaAutorizacion(usr)),
          map((usr) => fromLogin.LoginfromTokensuccess({ usuario: usr })),
          catchError((rror) => of(fromLogin.TokenTryFailed()))
        )
      )
    )
  ); */
  @Effect()
  tryTokenEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Trytoken),
        exhaustMap((accion) => {
          return this.loginservice.tryToken().pipe(
            map((u) => {
              this.loginservice.salvaAutorizacion(u);
              return fromLogin.LoginfromTokensuccess({ usuario: u });
            }),
            catchError((rror: HttpErrorResponse) =>
              of(fromLogin.TokenTryFailed({ error: rror }))
            )
          );
        })
      ),
    { resubscribeOnError: false }
  );

  @Effect({ dispatch: false })
  loginSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Loginsuccess),
        distinctUntilChanged(),
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
  loginNormalFailledEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.NormalLoginFail),
        distinctUntilChanged(),
        tap((_) =>
          this.snackBar.open(
            'Anwender und oder Passwort nicht bekannt!!',
            null,
            {
              duration: 5000
            }
          )
        )
      ),
    { dispatch: false }
  );

  @Effect({ dispatch: false })
  loginFailEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Loginfail),
        distinctUntilChanged(),
        tap((accion) => {
          this.loginservice.deleteToken();
          let msg: string;
          if (isUndefined(accion.error.status)) {
            msg = `Etwas ist schiff gegangen !!`;
            console.log(accion.error);
          } else {
            if (accion.error.status === 500) {
              msg = `Upppps! Internal Server Error ${accion.error.message}`;
            } else if (accion.error.status === 401) {
              msg = `Anwender und/oder Passwort nicht bekantt!!`;
            }
          }
          this.snackBar.open(msg, null, {
            duration: 5000
          });
        })
      ),
    { dispatch: false }
  );
  /* @Effect({ dispatch: false })
  TokenTryFailedEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.TokenTryFailed),
        // distinctUntilChanged(),
        map((accion) => {
          this.loginservice.deleteToken();
          console.log(accion.error);
          this.router.navigate(['/login']);
        })
        // , tap((_) => console.log('Ahora Routing to Login'))
        // , tap((_) => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  ); */
  @Effect()
  TokenTryFailedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromLogin.TokenTryFailed),
      map((accion) => {
        this.loginservice.deleteToken();
        this.router.navigate(['/login']);
        let msg = '';
        if (isUndefined(accion.error.status)) {
          msg = 'Etwas ist schiff gegangen!!!';
          console.log(accion.error);
        } else {
          if (accion.error.status === 500) {
            msg = `Upppps! Internal Server Error ${accion.error.message}`;
          }
        }
        if (msg.length > 0) {
          this.snackBar.open(msg, null, { duration: 5000 });
        }
        return fromLogin.LoginNoAction();
      })
    )
  );
  @Effect({ dispatch: false })
  LogoutEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Logout),
        distinctUntilChanged(),
        tap((_) => this.loginservice.deleteToken()),
        tap((_) => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );
}
