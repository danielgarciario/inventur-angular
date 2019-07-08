import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  tap,
  distinctUntilChanged,
  mergeMap,
  filter,
  switchMap
} from 'rxjs/operators';

import * as fromErrorActions from '../actions/error';
import * as fromSnackBarActions from '../actions/snackbar';
import * as fromLoginActions from '../../login-store/login.actions';

@Injectable()
export class ErrorEffects {
  constructor(private actions$: Actions) {}

  /* @Effect()
  showErrorEffect$ = createEffect(()=>
  this.actions$.pipe(
    ofType(fromErrorActions.HttpError),
    tap(accion => console.log(accion.err))
    ,filter(accion => accion.err.status!== undefined && accion.err.status==401)
    ,map(a => fromLoginActions.Logout)
    map(accion=> {
      if (accion.err.status!== undefined && accion.err.status==0)
    })
  )
  ); */

  @Effect()
  showErrorEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromErrorActions.HttpError),
      tap((accion) => console.log(accion.err)),
      map((accion) => {
        if (accion.err.status !== undefined && accion.err.status == 401) {
          return fromLoginActions.Logout();
        }
        let msg: string;
        if (accion.err.status !== undefined && accion.err.status == 0) {
          msg = 'Etwas ist schief gegangen!!';
        } else {
          msg = accion.err.message;
        }
        return fromSnackBarActions.SnackbarOpen({ mensaje: msg });
      })
    )
  );
}
