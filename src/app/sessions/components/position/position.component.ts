import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Observable, fromEvent, Subscription, combineLatest } from 'rxjs';
import { SesionPos } from 'src/app/models/sespos.model';
import { AppEstado } from 'src/app/root-store/root-store.state';
import { Store, select } from '@ngrx/store';
import * as fromSesionSelectors from '../../../root-store/sessions-store/selectors';
import * as fromSesionActions from '../../../root-store/sessions-store/actions';
import { tap, switchMap, map, filter } from 'rxjs/operators';
import { MatButton } from '@angular/material';
import { BestandID } from 'src/app/models/bestand.model';
import { GezahltID } from 'src/app/models/Gezaehlt.model';
import { SesionStates } from 'src/app/models/sesionstatesenum.enum';
import { environment } from 'src/environments/environment';

/*
Inspiracion: https://stackoverflow.com/questions/37770226/observable-from-button-click-event-in-angular2
*/

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
})
export class PositionComponent implements OnInit, AfterViewInit, OnDestroy {
  snapshot: ActivatedRouteSnapshot;
  idposicion: number;
  idsesion: number;
  position$: Observable<SesionPos>;
  modificada$: Observable<boolean>;
  zuruckbuttonclick$: Observable<Event>;
  deltebuttonclick$: Observable<Event>;

  inventurSesion$: Observable<boolean>;
  showGezahlt$: Observable<boolean>;

  subszuruck: Subscription;
  subsdelete: Subscription;
  subpos: Subscription;
  subnavigate: Subscription;
  posicion: SesionPos;
  magicKey: string;

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppEstado>,
    private router: Router
  ) {
    this.snapshot = route.snapshot;
    this.magicKey = environment.magickey;
  }

  @ViewChild('btnzurucksesion', { static: true })
  btnzuruck: MatButton;
  @ViewChild('btndeletesesposition', { static: true })
  btndelete: MatButton;

  ngAfterViewInit() {
    this.zuruckbuttonclick$ = fromEvent(
      this.btnzuruck._elementRef.nativeElement,
      'click'
    );
    this.deltebuttonclick$ = fromEvent(
      this.btndelete._elementRef.nativeElement,
      'click'
    );
    this.subszuruck = this.zuruckbuttonclick$
      .pipe(
        switchMap((e) => this.position$),
        map((p) =>
          this.router.navigate(['../../session', p.idsesion], {
            relativeTo: this.route,
          })
        )
      )
      .subscribe();
    this.subsdelete = this.deltebuttonclick$
      // .pipe(
      //   switchMap((e) => this.position$),
      //   tap(() => console.log('dentro de delete')),
      //   map((p) =>
      //     this.store$.dispatch(
      //       fromSesionActions.ConfirDeleteSesionPosicion({
      //         sesionid: p.idsesion,
      //         posicionid: p.idsespos
      //       })
      //     )
      //   )
      // )
      .subscribe(() => {
        this.store$.dispatch(
          fromSesionActions.ConfirDeleteSesionPosicion({
            sesionid: this.idsesion,
            posicionid: this.idposicion,
          })
        );
      });
    this.subnavigate = this.position$
      .pipe(
        filter((p) => {
          if (p === undefined) {
            return true;
          }
          if (p.artikel === undefined) {
            return true;
          }
          return false;
        }),
        tap(() =>
          this.router.navigate(['../../session', this.idsesion], {
            relativeTo: this.route,
          })
        )
      )
      .subscribe();

    // this.subnavigate = this.store$
    //   .select(fromSesionSelectors.DameSesPosicionDeleteSuccess)
    //   .pipe(
    //     tap(() => {
    //       console.log('elemento borrado con exito');
    //       this.store$.dispatch(
    //         fromSesionActions.DeleteSesionPosicionAcknowledge()
    //       );
    //     }),
    //     switchMap((e) => this.position$),
    //     tap((p) =>
    //       this.router.navigate(['../../sesion', p.idsesion], {
    //         relativeTo: this.route
    //       })
    //     )
    //   )
    //   .subscribe();

    // fromActions.DeleteGezhaltIDSuccess
  }

  ngOnInit() {
    this.idposicion = +this.snapshot.paramMap.get('id');
    this.store$.dispatch(
      fromSesionActions.TrySetSelectedPosition({ posicionid: this.idposicion })
    );
    this.position$ = this.store$.pipe(
      select(fromSesionSelectors.DamePosicionId, { posid: this.idposicion })
    );
    this.modificada$ = this.store$.pipe(
      select(fromSesionSelectors.DameSiPosicionEstaModificada)
    );
    this.subpos = this.position$.subscribe((p) => {
      this.posicion = p;
      if (p !== undefined) {
        if (p.idsesion !== undefined) {
          this.idsesion = p.idsesion;
        }
      }
    });
    this.inventurSesion$ = this.store$
      .pipe(select(fromSesionSelectors.DameSelectedSession))
      .pipe(
        map((s) => {
          const stat: number = s.statusSesion;
          const inv: number = SesionStates.Inventario;
          console.log('Leyendo status sesion: ', stat);
          // tslint:disable-next-line: no-bitwise
          return (stat & inv) === inv;
        })
      );
    this.showGezahlt$ = combineLatest(
      this.inventurSesion$,
      this.position$
    ).pipe(
      map(([invses, pos]) => {
        if (pos.artikel.seri === 1) {
          return true;
        }
        return !invses;
      })
    );

    // this.zuruckbuttonclick
    //   .pipe(
    //     switchMap((e) => this.position$),
    //     map((p) => {
    //       console.log(p);
    //       return this.router.navigate(['../../session', p.idsesion], {
    //         relativeTo: this.route
    //       });
    //     })
    //   )
    //   .subscribe();
  }

  onDeletePosition() {
    this.position$.pipe(
      map((p) =>
        fromSesionActions.ConfirDeleteSesionPosicion({
          sesionid: p.idsesion,
          posicionid: p.idsespos,
        })
      )
    );
  }
  onSavePosition() {
    this.store$.dispatch(
      fromSesionActions.TrySaveGezhaltID({
        posicion: this.posicion,
        rutadestinoOK: '/sessions/session',
      })
    );
  }

  onCopyBestandID2GezahltID(id: BestandID) {
    this.store$.dispatch(
      fromSesionActions.TryAddSerialBestandToGezahlt({
        idsespos: id.idsespos,
        serl: id.serl,
      })
    );
  }

  onResetGezahltID(gez: GezahltID) {
    this.store$.dispatch(
      fromSesionActions.TryResetGezhaltID({
        gezahltId: gez,
      })
    );
  }
  onShowGezhaltIDDetaill(gez: GezahltID) {
    this.store$.dispatch(
      fromSesionActions.ShowPosGezahlDetailID({
        sespos: this.posicion,
        gezhaltid: gez,
      })
    );
  }
  onDeleteGezahltIDDetail(gez: GezahltID) {
    this.store$.dispatch(
      fromSesionActions.ConfirmDeleteGezahltID({
        posicion: this.posicion,
        gezahltId: gez,
      })
    );
  }
  onNewGezhaltID() {
    let ngid: GezahltID;
    ngid = {
      idgezahlt: 0,
      serl: '',
      idsespos: this.idposicion,
      gezahlt: 1,
      comment: '',
      status: SesionStates.Abierto,
    };
    this.store$.dispatch(
      fromSesionActions.ShowPosGezahlDetailID({
        sespos: this.posicion,
        gezhaltid: ngid,
      })
    );
  }
  onChangedGezhalt(ngid: GezahltID) {
    const pos = { ...this.posicion };
    const gez = new Array<GezahltID>();
    gez.push(ngid);
    pos.gezahlt = gez;

    this.store$.dispatch(
      fromSesionActions.ChangePosGezhalDetailMasiv({
        npgezahlt: pos,
      })
    );
  }

  onMagicKeyEvent() {
    this.onSavePosition();
  }

  ngOnDestroy() {
    this.subszuruck.unsubscribe();
    this.subsdelete.unsubscribe();
    this.subpos.unsubscribe();
    this.subnavigate.unsubscribe();
  }
}
