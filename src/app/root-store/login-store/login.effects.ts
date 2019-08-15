import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Actions,
  createEffect,
  ofType,
  Effect,
  OnIdentifyEffects
} from '@ngrx/effects';
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
  debounceTime,
  mapTo
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
  ) {}

  tryloginEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromLogin.Trylogin),
      exhaustMap((accion) =>
        this.loginservice.trylogin(accion.username, accion.password).pipe(
          map((usr) => {
            if (usr === null) {
              return fromLogin.LoginUnbekannt();
            }
            this.loginservice.saveTheToken(usr);
            return fromLogin.Loginsuccess({ usuario: usr });
          }),
          catchError((rror: HttpErrorResponse) =>
            of(
              fromLogin.Loginfail({
                status: rror.status,
                mensaje: rror.statusText as string
              })
            )
          )
        )
      )
    )
  );

  tryTokenEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Trytoken),
        exhaustMap((accion) =>
          this.loginservice.tryToken().pipe(
            map((u) => {
              this.loginservice.salvaAutorizacion(u);
              return fromLogin.Loginsuccess({ usuario: u });
            }),
            catchError((rror: HttpErrorResponse) =>
              of(
                fromLogin.TokenTryFailed({
                  status: rror.status,
                  mensaje: rror.statusText as string
                })
              )
            )
          )
        )
      ),
    { resubscribeOnError: false }
  );

  loginSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Loginsuccess),
        tap((_) => this.router.navigate(['/sessions']))
      ),
    { dispatch: false }
  );

  loginFailEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.Loginfail),
        tap((accion) => {
          this.loginservice.deleteToken();
          let msg: string;
          msg = accion.mensaje;
          if (isUndefined(accion.status)) {
            msg = `Etwas ist schiff gegangen !!`;
            console.log(accion.mensaje);
          } else {
            if (accion.status === 500) {
              msg = `Upppps! Internal Server Error ${accion.mensaje}`;
            } else if (accion.status === 401) {
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

  loginUnbekannt$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.LoginUnbekannt),
        tap((accion) =>
          this.snackBar.open('Anwender und/oder Passwort nicht bekannt', null, {
            duration: 500
          })
        )
      ),
    { dispatch: false }
  );

  TokenTryFailedEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromLogin.TokenTryFailed),
        map((accion) => {
          this.loginservice.deleteToken();
          this.router.navigate(['/login']);
          let msg = '';
          if (isUndefined(accion.status)) {
            msg = 'Etwas ist schiff gegangen!!!';
            console.log(accion.mensaje);
          } else {
            if (accion.status === 500) {
              msg = `Upppps! Internal Server Error ${accion.mensaje}`;
            }
          }
          if (msg.length > 0) {
            this.snackBar.open(msg, null, { duration: 5000 });
          }
        })
      ),
    { dispatch: false }
  );

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
