import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  tap,
  distinctUntilChanged,
  withLatestFrom,
  switchMap,
  exhaustMap,
  mergeMap
} from 'rxjs/operators';

import { User } from '../../models/user.model';
// import { LoginStoreSelectors, RootStoreState } from '../index';

import { LoginState } from '../login-store/login.state';

import * as fromActions from './actions';
import * as fromLoginActions from '../login-store/login.actions';
import { SessionsService } from '../../services/sessions.service';
import { Store, select } from '@ngrx/store';
import * as fromLoginSelectors from '../login-store/login.selectors';
import * as fromSelectors from './selectors';
import { HttpErrorResponse } from '@angular/common/http';
import * as fromSharedError from '../shared/actions/error';
import { AppEstado } from '../root-store.state';

@Injectable({
  providedIn: 'root'
})
export class SessionsStoreEffects {
  constructor(
    private actions$: Actions,
    private sesionService: SessionsService,
    // private store$: Store<RootStoreState.Estado>
    private store$: Store<AppEstado>
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

  /*  @Effect()
  loadSessionsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LoadSesions),
      withLatestFrom(
        this.loginstore$.pipe(select(fromLoginSelectors.loginUsuario))
      ),
      exhaustMap(([a, usr]) =>
        this.sesionService.getSessions(usr.emno).pipe(
          map((ss) => fromActions.LoadSesionsSuccess({ nuevassesiones: ss })),
          catchError((rr: HttpErrorResponse) =>
            of(fromSharedError.HttpError({ err: rr }))
          )
        )
      )
    )
  ); */
  /*  @Effect()
  loadSessionsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LoadSesions),
      withLatestFrom(
        this.loginstore$.pipe(select(fromLoginSelectors.loginUsuario))
      ),
      exhaustMap(([a, usr]) =>
        this.sesionService.getSessions(usr.emno).pipe(
          map((ses) => fromActions.LoadSesionsSuccess({ nuevassesiones: ses })),
          catchError((rr: HttpErrorResponse) =>
            of(fromSharedError.HttpError({ err: rr }))
          )
        )
      )
    )
  ); */
  @Effect()
  loadSessionsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LoadSesions),
      concatMap((accion) =>
        of(accion).pipe(
          withLatestFrom(
            this.store$.pipe(select(fromLoginSelectors.loginUsuario))
          )
        )
      ),
      exhaustMap(([a, usr]) =>
        this.sesionService.getSessions(usr.emno).pipe(
          map((ses) => fromActions.LoadSesionsSuccess({ nuevassesiones: ses })),
          catchError((rr: HttpErrorResponse) =>
            of(fromSharedError.HttpError({ err: rr }))
          )
        )
      )
    )
  );

  @Effect({ dispatch: false })
  selectedSessionEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.SelectSesion),
        distinctUntilChanged(),
        tap((_) => {
          console.log('Borrando Memoizing Session');
          fromSelectors.BorraMemoizs();
        })
      ),
    { dispatch: false }
  );
  @Effect()
  loadPositionsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LoadPositions),
      concatMap((accion) =>
        of(accion).pipe(
          withLatestFrom(
            this.store$.pipe(select(fromSelectors.DameSessionSelectedId))
          )
        )
      ),
      exhaustMap(([a, idses]) =>
        this.sesionService.getOffenePositions(idses).pipe(
          map((sp) => {
            // console.log('Ha devuelto algo...');
            // console.log(sp);
            return fromActions.LoadPositionsSuccess({ nuevasposiciones: sp });
          }),
          catchError((rr: HttpErrorResponse) =>
            of(fromSharedError.HttpError({ err: rr }))
          )
        )
      )
    )
  );

  @Effect()
  loadKandidatosEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.BuscaCandidatosLagerOrt),
      exhaustMap((a) =>
        this.sesionService
          .getKandidatosFromLagerOrt(
            a.localizacion.lager,
            a.localizacion.lagerplatz
          )
          .pipe(
            map((sp) =>
              fromActions.CandidatosLagerOrtSuccess({ nuevosCandidatos: sp })
            ),
            catchError((rr: HttpErrorResponse) =>
              of(fromSharedError.HttpError({ err: rr }))
            )
          )
      )
    )
  );
  @Effect()
  loadKandidatosFromItemEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.BuscaCandidatosItem),
      exhaustMap((a) =>
        this.sesionService.getKandidatosFromArtikel(a.item, a.lager).pipe(
          map((sp) =>
            fromActions.BuscaCandidatosItemSuccess({ nuevosCandidatos: sp })
          ),
          catchError((rr: HttpErrorResponse) =>
            of(fromSharedError.HttpError({ err: rr }))
          )
        )
      )
    )
  );

  @Effect()
  buscaArticulosEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.buscaArticulos),
      distinctUntilChanged(),
      exhaustMap((a) =>
        this.sesionService.getArtikelPotencials(a.busqueda).pipe(
          map((sp) => {
            if (sp.length === 1) {
              return fromActions.seleccionaArticulo({
                articuloseleccionado: sp[0]
              });
            }
            return fromActions.buscaArticulosSucess({ nuevospotenciales: sp });
          }),
          catchError((rr: HttpErrorResponse) =>
            of(fromSharedError.HttpError({ err: rr }))
          )
        )
      )
    )
  );
  @Effect()
  seleccionaArticuloEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.seleccionaArticulo),
      distinctUntilChanged(),
      withLatestFrom(
        this.store$.pipe(select(fromSelectors.DameSelectedSession))
      ),
      map(([a, ses]) => {
        return fromActions.BuscaCandidatosItem({
          item: a.articuloseleccionado.artikelnr,
          lager: ses.lager
        });
      })
    )
  );
  @Effect()
  seleccionaKandidatoEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.seleccionaCandidato),
      distinctUntilChanged(),
      tap((_) => console.log('Pasando Efecto Kandidato')),
      withLatestFrom(
        this.store$.pipe(select(fromSelectors.DameSelectedSession))
      ),
      exhaustMap(([ac, ses]) =>
        this.sesionService
          .addSesionPosition(
            ses.idSesion,
            ac.selectKandidato.articulo.artikelnr,
            ac.selectKandidato.lagerort.lagerplatz
          )
          .pipe(
            map((sp) => {
              if (sp != null) {
                return fromActions.AddSesionPosSuccess({ nuevasespos: sp });
              }
              return fromActions.AddSesionPosFailed();
            }),
            catchError((rr: HttpErrorResponse) =>
              of(fromSharedError.HttpError({ err: rr }))
            )
          )
      )
    )
  );
}
