import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  ParamMap,
  ActivatedRouteSnapshot
} from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../root-store/sessions-store/actions';
import * as fromSelectors from '../../../root-store/sessions-store/selectors';
import { Observable, Subscription, fromEvent, pipe } from 'rxjs';
import { Sesion } from 'src/app/models/sesion.model';
import { SesionPos } from 'src/app/models/sespos.model';
import { ExcelService } from 'src/app/services/excel.service';
import { AppEstado } from 'src/app/root-store/root-store.state';
import { Lager } from 'src/app/models/lager.model';
import { SessionsService } from 'src/app/services/sessions.service';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.scss']
})
export class SesionComponent implements OnInit, AfterViewInit, OnDestroy {
  snapshot: ActivatedRouteSnapshot;
  loading$: Observable<boolean>;
  posiciones$: Observable<Array<SesionPos>>;
  posiciones: Array<SesionPos>;
  posisubscript: Subscription;
  thissesion: Sesion;
  thislager: Lager;
  thissesionsubs: Subscription;
  thislagersubs: Subscription;
  zuruckbuttonclick$: Observable<Event>;
  subszuruck: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<AppEstado>,
    private sservice: SessionsService,
    private excel: ExcelService
  ) {
    this.snapshot = route.snapshot;
  }
  @ViewChild('btnzurucksesions', { static: true })
  btnzuruck: MatButton;

  ngOnInit() {
    const id = +this.snapshot.paramMap.get('id');
    console.log(`En SesionComponent para ID= ${id}`);
    /* Pedimos que se seleccione el ID que nos pasan */
    this.store$.dispatch(fromActions.SelectSesion({ selectedSesionId: id }));
    this.thissesionsubs = this.store$
      .select(fromSelectors.DameSelectedSession)
      .subscribe((s) => {
        this.thissesion = s;
        this.thislagersubs = this.sservice
          .getlager(s.lager.cwar)
          .subscribe((l) => (this.thislager = l));
      });
    this.loading$ = this.store$.select(fromSelectors.isLoadingPositions);
    this.posiciones$ = this.store$.select(fromSelectors.DamePosiciones);
    this.posisubscript = this.posiciones$.subscribe((p) => {
      this.posiciones = p;
    });
    this.store$.dispatch(fromActions.LoadPositions());
  }
  ngAfterViewInit() {
    this.zuruckbuttonclick$ = fromEvent(
      this.btnzuruck._elementRef.nativeElement,
      'click'
    );
    this.subszuruck = this.zuruckbuttonclick$
      .pipe(
        map((_) =>
          this.router.navigate(['../../sessions'], { relativeTo: this.route })
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.posisubscript.unsubscribe();
    this.thissesionsubs.unsubscribe();
    this.thislagersubs.unsubscribe();
    this.subszuruck.unsubscribe();
  }

  onDeletePosicion(pos: SesionPos) {
    console.log('Delete Position');
    this.store$.dispatch(
      fromActions.ConfirDeleteSesionPosicion({
        sesionid: pos.idsesion,
        posicionid: pos.idsespos
      })
    );
  }
  onGotoPosition(pos: SesionPos) {
    console.log(`Goto Posistion: ${pos.idsespos} from ${this.route}`);

    this.router.navigate(['../../position', pos.idsespos], {
      relativeTo: this.route
    });
    /*
    this.store$.dispatch(
      fromActions.SelectSesion({ selectedSesionId: ses.idSesion })
    );
    */
  }

  onExportToExcel() {
    const wb = this.excel.generaWorkBookPosiciones(this.posiciones);

    this.excel.grabaWorkbook(wb, 'tests.xlsx');
  }
  onNeuePosition() {
    this.router.navigate(
      ['../../neueposition', this.snapshot.paramMap.get('id')],
      {
        relativeTo: this.route
      }
    );
  }
}
