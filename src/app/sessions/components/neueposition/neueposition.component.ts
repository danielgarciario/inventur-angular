import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivatedRoute,
  Router,
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
import { SuchenArtikelFacadeV3Service } from 'src/app/services/facade/suchenArtikelV3.facade.service';
import { LagerStruct } from 'src/app/models/lagerstrukt.model';
import { Localizador } from 'src/app/models/lagerort.model';
import { KandidatoPartComponent } from './kandidatospart/kandidatopart.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-neueposition',
  templateUrl: './neueposition.component.html',
  styleUrls: ['./neueposition.component.scss'],
})
export class NeuePositionComponent implements OnInit, OnDestroy {
  snapshot: ActivatedRouteSnapshot;
  subsesion: Subscription;
  subnavigate: Subscription;
  sublagerstruct: Subscription;
  lager: LagerSesion;
  lagerstruct: LagerStruct;

  artikelnr: ValidadorTipo<string>;
  // artikelbes: ValidadorTipo<string>;
  lagerplatz: ValidadorTipo<string>;
  suskandcomp: Subscription;
  kandcompleto: boolean;
  magicKey: string;

  constructor(
    public facade: SuchenArtikelFacadeV3Service,
    private store$: Store<AppEstado>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.snapshot = route.snapshot;
    this.suskandcomp = this.facade.kandidatoCompleto$.subscribe(
      (b) => (this.kandcompleto = b)
    );
    this.magicKey = environment.magickey;
    // this.subsesion = facade.lager$.subscribe((l) => (this.lager = l));
    // this.sublagerstruct = facade.lagerstruct$.subscribe((ls) => {
    //   this.lagerstruct = ls;
    //   console.log('lagerstruct', ls);
    // });
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log('Keyboard event', event);
    if (event.key === this.magicKey) {
      if (this.kandcompleto) {
        this.createposition();
      }
    }
  }

  ngOnInit() {
    const id = +this.snapshot.paramMap.get('id');
    console.log(`En NeuePosition para ID= ${id}`);
    this.facade.limpiaCacheArticulo();

    this.artikelnr = this.facade.vArtnum;
    // this.artikelbes = this.facade.vBesch;
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
          relativeTo: this.route,
        });
      });
  }

  selectkandidato(elkandidato: Kandidato) {
    this.store$.dispatch(
      fromActions.seleccionaCandidato({ selectKandidato: elkandidato })
    );
  }

  createposition() {
    const miarticulo = this.facade.kandidato$.value.articulo;
    const lo = this.facade.kandidato$.value.lagerot;
    const kand = {
      articulo: miarticulo,
      lagerort: { lager: lo.cwar, lagerplatz: lo.loca, regal: lo.rega },
    };
    this.store$.dispatch(
      fromActions.seleccionaCandidato({ selectKandidato: kand })
    );
  }

  ngOnDestroy() {
    this.suskandcomp.unsubscribe();
    // this.subsesion.unsubscribe();
    // this.subnavigate.unsubscribe();
  }
}
