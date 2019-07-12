import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  tap,
  distinctUntilChanged,
  withLatestFrom,
  switchMap
} from 'rxjs/operators';

import { User } from '../../models/user.model';
// import { LoginStoreSelectors, RootStoreState } from '../index';
import { Estado } from '../sessions-store/state';
import { LoginState } from '../login-store/login.state';

import * as fromActions from './actions';
import * as fromLoginActions from '../login-store/login.actions';
import { SessionsService } from '../../services/sessions.service';
import { Store, select } from '@ngrx/store';
import * as fromLoginSelectors from '../login-store/login.selectors';
import { HttpErrorResponse } from '@angular/common/http';
import * as fromSharedError from '../shared/actions/error';

@Injectable()
export class SessionsStoreEffects {
  constructor(
    private actions$: Actions,
    private sesionService: SessionsService,
    // private store$: Store<RootStoreState.Estado>
    // private store$: Store<Estado>,
    private loginstore$: Store<LoginState>
  ) {}

  /*
  Modelo....
  @Effect()
shipOrder = this.actions.pipe(
  ofType<ShipOrder>(ActionTypes.ShipOrder),
  map(action => action.payload),
  concatMap(action =>
    of(action).pipe(
      withLatestFrom(store.pipe(select(getUserName)))
    )
  ),
  map([payload, username] => {
    ...
  })  */

  @Effect()
  loadSessionsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LoadSesions),
      withLatestFrom(
        this.loginstore$.pipe(select(fromLoginSelectors.loginUsuario))
      ),
      switchMap(([a, usr]) =>
        this.sesionService.getSessions(usr.emno).pipe(
          map((ss) => fromActions.LoadSesionsSuccess({ nuevassesiones: ss })),
          catchError((rr: HttpErrorResponse) =>
            of(fromSharedError.HttpError({ err: rr }))
          )
        )
      )
    )
  );
}
