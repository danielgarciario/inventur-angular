import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivatedRoute,
  Router
} from '@angular/router';
import { SuchenArtikelFacadeService } from 'src/app/services/facade/suchenArtikel.facade.service';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { LagerSesion } from 'src/app/models/sesion.model';
import { Validador } from 'src/app/helpers-module/Validador/validador.model';
import { Kandidato } from 'src/app/models/kandidato.model';
import { Store } from '@ngrx/store';
import { AppEstado } from 'src/app/root-store/root-store.state';
import * as fromActions from '../../../root-store/sessions-store/actions';
import * as fromSelectors from '../../../root-store/sessions-store/selectors';
import { concatMap, filter, withLatestFrom, map } from 'rxjs/operators';
import { SuchenArtikelFacade2Service } from 'src/app/services/facade/suchenArtikelV2.facade.service';
import { ValidadorTipo } from 'src/app/helpers-module/Validador/VadlidadorTipo.model';

@Component({
  selector: 'app-neueposition',
  templateUrl: './neueposition.component.html',
  styleUrls: ['./neueposition.component.scss']
})
export class NeuePositionComponent implements OnInit, OnDestroy {
  snapshot: ActivatedRouteSnapshot;
  subsesion: Subscription;
  subnavigate: Subscription;
  lager: LagerSesion;

  artikelnr: ValidadorTipo<string>;
  artikelbes: ValidadorTipo<string>;
  lagerplatz: ValidadorTipo<string>;

  constructor(
    public facade: SuchenArtikelFacade2Service,
    private store$: Store<AppEstado>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.snapshot = route.snapshot;
    this.subsesion = facade.lager$.subscribe((l) => (this.lager = l));
  }

  ngOnInit() {
    const id = +this.snapshot.paramMap.get('id');
    console.log(`En NeuePosition para ID= ${id}`);

    this.artikelnr = this.facade.vArtnum;
    this.artikelbes = this.facade.vBesch;
    this.lagerplatz = this.facade.vLagerplatz;
    this.subnavigate = this.store$
      .select(fromSelectors.DameSesPosicionCreateSuccess)
      .pipe(
        filter((r) => r),
        concatMap((r) =>
          of(r).pipe(
            withLatestFrom(
              this.store$.select(fromSelectors.DameSelectedPosition)
            )
          )
        ),
        map(([r, nsp]) => {
          if (r) {
            return nsp;
          }
        })
      )
      .subscribe((nsp) => {
        console.log(`Hemos anadido nueva posicion`, nsp);
        this.store$.dispatch(fromActions.AddSesionPosSuccessAcknowledge());
        this.router.navigate(['../../position', nsp.idsespos], {
          relativeTo: this.route
        });
      });
  }

  selectkandidato(elkandidato: Kandidato) {
    this.store$.dispatch(
      fromActions.seleccionaCandidato({ selectKandidato: elkandidato })
    );
  }

  ngOnDestroy() {
    this.subsesion.unsubscribe();
    this.subnavigate.unsubscribe();
  }
}
