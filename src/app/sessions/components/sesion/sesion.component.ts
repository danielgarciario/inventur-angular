import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  ParamMap,
  ActivatedRouteSnapshot
} from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../root-store/sessions-store/actions';
import * as fromSelectors from '../../../root-store/sessions-store/selectors';
import { Observable, Subscription } from 'rxjs';
import { Sesion } from 'src/app/models/sesion.model';
import { SesionPos } from 'src/app/models/sespos.model';
import { ExcelService } from 'src/app/services/excel.service';
import { AppEstado } from 'src/app/root-store/root-store.state';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.scss']
})
export class SesionComponent implements OnInit, OnDestroy {
  snapshot: ActivatedRouteSnapshot;
  sesion$: Observable<Sesion>;
  loading$: Observable<boolean>;
  posiciones$: Observable<Array<SesionPos>>;
  posiciones: Array<SesionPos>;
  posisubscript: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<AppEstado>,
    private excel: ExcelService
  ) {
    this.snapshot = route.snapshot;
  }

  ngOnInit() {
    const id = +this.snapshot.paramMap.get('id');
    console.log(`En SesionComponent para ID= ${id}`);
    /* Pedimos que se seleccione el ID que nos pasan */
    this.store$.dispatch(fromActions.SelectSesion({ selectedSesionId: id }));
    this.sesion$ = this.store$.select(fromSelectors.DameSelectedSession);
    this.loading$ = this.store$.select(fromSelectors.isLoadingPositions);
    this.posiciones$ = this.store$.select(fromSelectors.DamePosiciones);
    this.posisubscript = this.posiciones$.subscribe((p) => {
      this.posiciones = p;
    });
    this.store$.dispatch(fromActions.LoadPositions());
  }

  ngOnDestroy() {
    this.posisubscript.unsubscribe();
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
