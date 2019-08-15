import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { delay, map, tap } from 'rxjs/operators';
import * as fromActions from '../actions/snackbar';

@Injectable()
export class SnackbarEffects {
  constructor(private actions$: Actions, private matSnackBar: MatSnackBar) {}

  // @Effect()
  openSnackbarEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.SnackbarOpen),
      tap((accion) => {
        console.log(`Mensaje ${accion.mensaje}`);
        this.matSnackBar.open(accion.mensaje, accion.action, accion.config);
      }),
      delay(5000),
      map(() => fromActions.SnackbarClose())
    )
  );

  // @Effect({ dispatch: false })
  closeSnackbarEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.SnackbarClose),
        tap(() => this.matSnackBar.dismiss())
      ),
    { dispatch: false }
  );
}
