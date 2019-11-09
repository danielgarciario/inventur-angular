import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { of, Observable, EmptyError, empty, EMPTY } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  tap,
  distinctUntilChanged,
  withLatestFrom,
  switchMap,
  exhaustMap,
  mergeMap,
  mapTo
} from 'rxjs/operators';

import { User } from '../../models/user.model';
// import { LoginStoreSelectors, RootStoreState } from '../index';

import { LoginState } from '../login-store/login.state';

import * as fromActions from './actions';
import * as fromLoginActions from '../login-store/login.actions';
import * as fromConfirmDelActions from '../shared/actions/confirm.delete';
import { SessionsService } from '../../services/sessions.service';
import { Store, select } from '@ngrx/store';
import * as fromLoginSelectors from '../login-store/login.selectors';
import * as fromSelectors from './selectors';
import { HttpErrorResponse } from '@angular/common/http';
import * as fromSharedError from '../shared/actions/error';
import * as fromSharedSnackbar from '../shared/actions/snackbar';
import { AppEstado } from '../root-store.state';
import { MatDialog } from '@angular/material';
import { DeleteConfirmDialogComponent } from '../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { GezahltID } from 'src/app/models/Gezaehlt.model';
import { SesionStates } from 'src/app/models/sesionstatesenum.enum';
import { SesionPos } from 'src/app/models/sespos.model';
import { Sesion } from 'src/app/models/sesion.model';
import {
  DialogGezhaltIDData,
  DialogPosicionGezhaltIDComponent
} from 'src/app/sessions/components/position/newgezhaltid/posnewgezid.dialog.component';
import { DialogCreateSesionComponent } from 'src/app/sessions/components/createsesion/createsesion.dialog.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionsStoreEffects {
  constructor(
    private actions$: Actions,
    private sesionService: SessionsService,
    // private store$: Store<RootStoreState.Estado>
    private store$: Store<AppEstado>,
    private matdialog: MatDialog,
    private router: Router
  ) {}

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
            of(
              fromSharedError.HttpError({
                status: rr.status,
                mensaje: rr.error
              })
            )
          )
        )
      )
    )
  );

  confirmdeleteposEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.ConfirDeleteSesionPosicion),
        concatMap((accion) =>
          of(accion).pipe(
            withLatestFrom(
              this.store$.pipe(
                select(fromSelectors.DamePosicionId, {
                  posid: accion.posicionid
                })
              )
            )
          )
        ),
        switchMap(([accion, pos]) => {
          const data = {
            delete: fromActions.DeleteSesionPosicion({
              sesionid: accion.sesionid,
              posicionid: accion.posicionid
            }),
            text: `<p>Bestätigen löschen Artikel: </p> <p>  <strong>${pos.artikel.artikelnr}</strong> ${pos.artikel.beschreibung} </p>`,
            title: 'Position löschen?'
          };
          this.matdialog.open(DeleteConfirmDialogComponent, { data });
          // tslint:disable-next-line: deprecation
          return empty();
        })
      ),
    { dispatch: false }
  );
  deletepositionEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.DeleteSesionPosicion),
      exhaustMap((accion) =>
        this.sesionService
          .deleteSesionPosicion(accion.sesionid, accion.posicionid)
          .pipe(
            map((r) =>
              fromActions.DeleteSesionPosicionSuccess({
                sesionid: accion.posicionid,
                posicionid: accion.posicionid
              })
            ),
            catchError((rr: HttpErrorResponse) =>
              of(
                fromSharedError.HttpError({
                  status: rr.status,
                  mensaje: rr.error
                })
              )
            )
          )
      )
    )
  );
  confirmdeletesesionEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.ConfirmDeleteSesion),
        concatMap((accion) =>
          of(accion).pipe(
            withLatestFrom(
              this.store$.pipe(
                select(fromSelectors.DameSesionID, {
                  sesionid: accion.sesionid
                })
              )
            )
          )
        ),
        switchMap(([accion, ses]) => {
          const data = {
            delete: fromActions.DeleteSesion({
              sesionid: accion.sesionid
            }),
            text: `<p>Bestätigen löschen Session: </p> <p>Id Sesion:<strong>${ses.idSesion}</strong> auf Lager: ${ses.lager}? </p>`,
            title: 'Sesion löschen?'
          };
          this.matdialog.open(DeleteConfirmDialogComponent, { data });
          // tslint:disable-next-line: deprecation
          return empty();
        })
      ),
    { dispatch: false }
  );
  deletesesionEffects = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.DeleteSesion),
      exhaustMap((accion) =>
        this.sesionService.deleteSesion(accion.sesionid).pipe(
          map((r) =>
            fromActions.DeleteSesionSuccess({ sesionid: accion.sesionid })
          ),
          catchError((rr: HttpErrorResponse) =>
            of(
              fromSharedError.HttpError({
                status: rr.status,
                mensaje: rr.error
              })
            )
          )
        )
      )
    )
  );

  selectedSessionEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.SelectSesion),
        tap((_) => {
          console.log('Borrando Memoizing Session');
          fromSelectors.BorraMemoizs();
        })
      ),
    { dispatch: false }
  );
  trySelectSelectedPositionEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.TrySetSelectedPosition),
      concatMap((a) =>
        of(a).pipe(
          withLatestFrom(
            this.store$.pipe(
              select(fromSelectors.DamePosicionId, { posid: a.posicionid })
            )
          )
        )
      ),
      map(([a, sp]) => {
        return fromActions.SetSelectPosition({ posicion: sp });
      })
    )
  );
  // @Effect()
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
            of(
              fromSharedError.HttpError({
                status: rr.status,
                mensaje: rr.error
              })
            )
          )
        )
      )
    )
  );

  // @Effect()
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
              of(
                fromSharedError.HttpError({
                  status: rr.status,
                  mensaje: rr.error
                })
              )
            )
          )
      )
    )
  );
  // @Effect()
  loadKandidatosFromItemEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.BuscaCandidatosItem),
      exhaustMap((a) =>
        this.sesionService.getKandidatosFromArtikel(a.item, a.lager).pipe(
          map((sp) =>
            fromActions.BuscaCandidatosItemSuccess({ nuevosCandidatos: sp })
          ),
          catchError((rr: HttpErrorResponse) =>
            of(
              fromSharedError.HttpError({
                status: rr.status,
                mensaje: rr.error
              })
            )
          )
        )
      )
    )
  );

  // @Effect()
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
            of(
              fromSharedError.HttpError({
                status: rr.status,
                mensaje: rr.error
              })
            )
          )
        )
      )
    )
  );
  // @Effect()
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
          lager: ses.lager.cwar
        });
      })
    )
  );
  // @Effect()
  seleccionaKandidatoEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.seleccionaCandidato),
      withLatestFrom(
        this.store$.pipe(select(fromSelectors.DameSelectedSession))
      ),
      exhaustMap(([ac, ses]) =>
        this.sesionService
          .addSesionPosition(
            ses.idSesion,
            ac.selectKandidato.articulo.artikelnr,
            ac.selectKandidato.lagerort.lagerplatz,
            ac.selectKandidato.lagerort.regal
          )
          .pipe(
            map((sp) => {
              if (sp != null) {
                return fromActions.AddSesionPosSuccess({ nuevasespos: sp });
              }
              return fromActions.AddSesionPosFailed();
            }),
            catchError((rr: HttpErrorResponse) =>
              of(
                fromSharedError.HttpError({
                  status: rr.status,
                  mensaje: rr.error
                })
              )
            )
          )
      )
    )
  );

  tryAddSerial2GezahltEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.TryAddSerialBestandToGezahlt),
      concatMap((a) =>
        of(a).pipe(
          withLatestFrom(
            this.store$.pipe(
              select(fromSelectors.DamePosicionId, { posid: a.idsespos })
            )
          )
        )
      ),
      map(([a, sp]) => {
        if (sp === null) {
          return fromActions.TryAddSerialBestandToGezahltFailed();
        }
        if (sp.gezahlt.some((x) => x.serl === a.serl)) {
          return fromActions.TryAddSerialBestandToGezahltFailed();
        }
        return fromActions.TryAddSerialBestandToGezahltSuccess({
          sespos: this.generaGezahltIDInPosition(a.serl, sp)
        });
      })
    )
  );
  tryAddSerialBestandToGezahltFailedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.TryAddSerialBestandToGezahltFailed),
      map((a) =>
        fromSharedSnackbar.SnackbarOpen({
          mensaje: 'ID schon verhandeln!'
        })
      )
    )
  );
  tryResetGezahltIDEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.TryResetGezhaltID),
      concatMap((a) =>
        of(a).pipe(
          withLatestFrom(
            this.store$.pipe(
              select(fromSelectors.DamePosicionId, {
                posid: a.gezahltId.idsespos
              })
            )
          )
        )
      ),
      map(([a, sp]) => {
        if (sp === null) {
          return fromActions.TryResetGezahltIDFailed();
        }
        if (sp.gezahlt.some((x) => x.serl === a.gezahltId.serl)) {
          return fromActions.TryResetGezhaltIDSucess({
            sespos: this.generaSesPosicionSinGezahltID(a.gezahltId.serl, sp)
          });
        }
      })
    )
  );

  createSesionEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.CrearSesion),
      exhaustMap((a) =>
        this.sesionService.createnewsesion(a.empno, a.lager, a.comment).pipe(
          map((s) => fromActions.CrearSesionSuccess({ nuevasesion: s })),
          catchError((rr: HttpErrorResponse) =>
            of(
              fromSharedError.HttpError({
                status: rr.status,
                mensaje: rr.error
              })
            )
          )
        )
      )
    )
  );
  createSesionInventarEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.CrearSesionInventur),
      exhaustMap((a) =>
        this.sesionService
          .createnewsesioninventario(a.empno, a.lager, a.idinventur, a.comment)
          .pipe(
            map((s) => fromActions.CrearSesionSuccess({ nuevasesion: s })),
            catchError((rr: HttpErrorResponse) =>
              of(
                fromSharedError.HttpError({
                  status: rr.status,
                  mensaje: rr.error
                })
              )
            )
          )
      )
    )
  );

  showCreateNewSesionEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.MostarDialogCrearSesion),
        map((a) =>
          this.matdialog.open(DialogCreateSesionComponent, {
            width: '500px',
            height: '350px'
          })
        )
      ),
    { dispatch: false }
  );

  showGezhaltDetailIDEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.ShowPosGezahlDetailID),
        map((a) => {
          const data: DialogGezhaltIDData = {
            idgezhalt: a.gezhaltid.idgezahlt,
            sespos: a.sespos,
            serl: a.gezhaltid.serl,
            gezahlt: a.gezhaltid.gezahlt,
            comment: a.gezhaltid.comment,
            Ok: false
          };
          this.matdialog.open(DialogPosicionGezhaltIDComponent, { data });
          // return empty();
        })
      ),
    { dispatch: false }
  );
  acceptChangesDetailIDEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.ChangePosGezahlDetailID),
      map((a) => {
        return fromActions.ChangePosGzehalDetailIDSuccess({
          sespos: this.generaSesPosicionConCambioDetailID(a.gdid)
        });
      })
    )
  );

  confirmdeletegezahltIDEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.ConfirmDeleteGezahltID),
        switchMap((accion) => {
          const data = {
            delete: fromActions.DeleteGezhaltID({
              posicion: accion.posicion,
              gezahltId: accion.gezahltId
            }),
            text: `<p>Bestätigen löschen Gezählt Data: </p> <p>Artikel:<strong>${accion.posicion.artikel.artikelnr} ${accion.posicion.artikel.beschreibung}</strong> </p>
              <p> Id Nr: <strong> ${accion.gezahltId.serl} </strong> </p>
              <p> Gezählt ${accion.gezahltId.gezahlt} </p>
              <p> Comment: ${accion.gezahltId.comment} </p> ? `,
            title: 'Gezählt ID löschen?'
          };
          this.matdialog.open(DeleteConfirmDialogComponent, { data });
          // tslint:disable-next-line: deprecation
          return empty();
        })
      ),
    { dispatch: false }
  );
  deleteGezhaltIDEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.DeleteGezhaltID),
      exhaustMap((ac) =>
        this.sesionService
          .deleteGezahltPosition(ac.posicion.idsespos, ac.gezahltId.idgezahlt)
          .pipe(
            map((r) => {
              if (r) {
                return fromActions.DeleteGezhaltIDSuccess({
                  posicion: this.generaSesPosicionSinGezahltIDdata(
                    ac.posicion,
                    ac.gezahltId
                  )
                });
              }
              return fromActions.DeleteGezhaltIDFailed();
            }),
            catchError((rr: HttpErrorResponse) =>
              of(
                fromSharedError.HttpError({
                  status: rr.status,
                  mensaje: rr.error
                })
              )
            )
          )
      )
    )
  );
  trySaveGezhaltIDEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.TrySaveGezhaltID),
      exhaustMap((a) =>
        this.sesionService.modifyGezhaltSesionPosition(a.posicion).pipe(
          map((r) =>
            fromActions.SaveGezhaltIDSucess({
              posicion: r,
              rutadestinoOK: a.rutadestinoOK
            })
          ),
          catchError((rr: HttpErrorResponse) =>
            of(
              fromSharedError.HttpError({
                status: rr.status,
                mensaje: rr.error
              })
            )
          )
        )
      )
    )
  );
  SaveGezhaltIDSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.SaveGezhaltIDSucess),
        map((a) => {
          this.router.navigate([a.rutadestinoOK, a.posicion.idsesion]);
        })
      ),
    { dispatch: false }
  );

  generaSesPosicionConCambioDetailID(a: DialogGezhaltIDData): SesionPos {
    const gez = new Array<GezahltID>();
    gez.push(...a.sespos.gezahlt);
    // gez = { ...a.sespos.gezahlt };
    const ng: GezahltID = {
      idgezahlt: a.idgezhalt,
      idsespos: a.sespos.idsespos,
      gezahlt: a.gezahlt,
      comment: a.comment,
      status: SesionStates.Abierto,
      serl: a.serl
    };
    let index: number;
    if (a.idgezhalt === 0) {
      index = gez.findIndex((g) => g.serl === a.serl);
      if (index < 0) {
        gez.push(ng);
      } else {
        gez[index] = ng;
      }
    } else {
      index = gez.findIndex((g) => g.idgezahlt === a.idgezhalt);
      if (index >= 0) {
        gez[index] = ng;
      }
    }
    const nsp: SesionPos = { ...a.sespos, gezahlt: gez };
    return nsp;
  }

  generaSesPosicionSinGezahltIDdata(sp: SesionPos, gi: GezahltID): SesionPos {
    const gez = sp.gezahlt.filter((x, i, a) => x.idgezahlt !== gi.idgezahlt);
    const nsp: SesionPos = { ...sp, gezahlt: gez };
    return nsp;
  }

  generaSesPosicionSinGezahltID(serl: string, sp: SesionPos): SesionPos {
    const gez = new Array<GezahltID>();
    gez.push(
      ...sp.gezahlt.map((g) => {
        if (g.serl === serl) {
          return { ...g, gezahlt: 0 };
        }
        return g;
      })
    );
    const nsp: SesionPos = { ...sp, gezahlt: gez };
    return nsp;
  }

  generaGezahltIDInPosition(serl: string, sp: SesionPos): SesionPos {
    console.log(`Anadiendo ${serl} en SesionPosition: ${sp.idsespos} `);
    let ngp: GezahltID;
    ngp = {
      serl,
      idgezahlt: 0,
      idsespos: sp.idsespos,
      gezahlt: 1,
      comment: '',
      status: SesionStates.Abierto
    };
    const gez = new Array<GezahltID>();
    gez.push(...sp.gezahlt);
    gez.push(ngp);
    const nsp: SesionPos = { ...sp, gezahlt: gez };
    return nsp;
  }
}
