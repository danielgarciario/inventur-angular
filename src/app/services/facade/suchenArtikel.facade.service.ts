import { Injectable } from '@angular/core';
import { SessionsService } from '../sessions.service';
import { Store } from '@ngrx/store';
import { AppEstado } from 'src/app/root-store/root-store.state';
import * as fromSesionSelectors from '../../root-store/sessions-store/selectors';
import { Kandidato } from 'src/app/models/kandidato.model';
import { Artikel } from 'src/app/models/artikel.model';

import {
  switchMap,
  map,
  debounceTime,
  distinctUntilChanged,
  filter,
  withLatestFrom,
  distinctUntilKeyChanged
} from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { LagerSesion } from 'src/app/models/sesion.model';
import { isUndefined } from 'util';

export interface SearchArtikelStrings {
  artikelnr: string;
  artikelbeschreibung: string;
}
export interface SearchLagerPlatzStrings {
  lagerplatz: string;
}

export interface SearchArticulos {
  criteria: SearchArtikelStrings;
  potenciales: Array<Artikel>;
  selectedPotencial: Artikel;
  isSearchingPotenciales: boolean;
  noPotenciales: boolean;
}

export interface SearchKandidatosState {
  articulos: SearchArticulos;
  kandidatos: Array<Kandidato>;
  criteriaLP: SearchLagerPlatzStrings;
  searchingKandidatos: boolean;
  KandidatosIsEmpty: boolean;
}

// tslint:disable-next-line: variable-name
const _criteriaArtikel: SearchArtikelStrings = {
  artikelnr: '',
  artikelbeschreibung: ''
};
// tslint:disable-next-line: variable-name
const _searcharticulosinicial: SearchArticulos = {
  criteria: _criteriaArtikel,
  potenciales: new Array<Artikel>(),
  selectedPotencial: null,
  isSearchingPotenciales: false,
  noPotenciales: true
};
// tslint:disable-next-line: variable-name
const _criterialpincial: SearchLagerPlatzStrings = {
  lagerplatz: ''
};

@Injectable({ providedIn: 'root' })
export class SuchenArtikelFacadeService {
  // tslint:disable-next-line: variable-name
  private _estado: SearchKandidatosState = {
    articulos: _searcharticulosinicial,
    kandidatos: new Array<Kandidato>(),
    criteriaLP: _criterialpincial,
    searchingKandidatos: false,
    KandidatosIsEmpty: true
  };

  private estado = new BehaviorSubject<SearchKandidatosState>(this._estado);
  private estado$ = this.estado.asObservable();
  private sesion$ = this.store$.select(fromSesionSelectors.DameSelectedSession);
  public lager$ = this.sesion$.pipe(
    map((s) => {
      if (s == null) {
        console.log('Selected Sesion is null');
        return null;
      }
      if (!s.hasOwnProperty('lager')) {
        return null;
      }

      return s.lager;
    })
  );
  public kandidatos$ = this.estado$.pipe(
    map((s) => s.kandidatos),
    distinctUntilChanged()
  );
  private articulos$ = this.estado$.pipe(
    map((s) => s.articulos),
    distinctUntilChanged()
  );
  public potenciales$ = this.articulos$.pipe(
    map((a) => a.potenciales),
    distinctUntilChanged()
  );
  public selectedpotencial$ = this.articulos$.pipe(
    map((a) => a.selectedPotencial),
    distinctUntilChanged()
  );
  private potencialescriteria$ = this.articulos$.pipe(
    map((a) => a.criteria),
    distinctUntilChanged()
  );
  public buscaartikelnr$ = this.potencialescriteria$.pipe(
    map((a) => a.artikelnr),
    distinctUntilChanged()
  );
  public buscaartikelberschreibung$ = this.potencialescriteria$.pipe(
    map((a) => a.artikelbeschreibung),
    distinctUntilChanged()
  );
  public searchingpotencial$ = this.articulos$.pipe(
    map((a) => a.isSearchingPotenciales),
    distinctUntilChanged()
  );
  public nopotencial$ = this.articulos$.pipe(
    map((a) => a.noPotenciales),
    distinctUntilChanged()
  );
  private criteriaLP$ = this.estado$.pipe(
    map((s) => s.criteriaLP),
    distinctUntilChanged()
  );
  public buscalagerplatz$ = this.criteriaLP$.pipe(
    map((clp) => clp.lagerplatz),
    distinctUntilChanged()
  );

  public searchingKandidatos$ = this.estado$.pipe(
    map((s) => s.searchingKandidatos),
    distinctUntilChanged()
  );
  public KandidatosisEmpty$ = this.estado$.pipe(
    map((s) => s.KandidatosIsEmpty),
    distinctUntilChanged()
  );
  private TriggerCriteriaLP$ = this.criteriaLP$.pipe(
    filter((x) => x.lagerplatz.length > 1),
    debounceTime(750),
    withLatestFrom(this.lager$)
  );
  private TriggerCriteriaArtikelNr$ = this.buscaartikelnr$.pipe(
    filter((x) => x.length > 1),
    debounceTime(750)
  );
  private TriggerBuscaKandidato$ = this.selectedpotencial$.pipe(
    filter((x) => x !== null)
  );

  public buscaArtikelNrFC: FormControl;
  public buscaLagerPlatzFC: FormControl;
  public buscaArtikelBeschreibungFC: FormControl;

  constructor(
    private sesserv: SessionsService,
    private store$: Store<AppEstado>
  ) {
    this.buscaArtikelNrFC = this.buildArtikelNrFormControl();
    this.buscaLagerPlatzFC = this.buildLagerPlatzFormControl();
    this.buscaArtikelBeschreibungFC = this.buildArtikelBeschreibungFormControl();
    // Observable sin candidatos entonces tengo que buscar en el servidor
    this.TriggerCriteriaLP$.pipe(
      withLatestFrom(this.kandidatos$),
      filter(([[slp, ls], k]) => k.length === 0 && ls.mitlagerplatz),
      switchMap(([[slp, ls], k]) => {
        this.updateEstado({
          ...this._estado,
          kandidatos: new Array<Kandidato>(),
          searchingKandidatos: true
        });
        return this.sesserv.getKandidatosFromLagerOrt(ls.cwar, slp.lagerplatz);
      }),
      switchMap((kan) => {
        this.updateEstado({
          ...this._estado,
          kandidatos: kan,
          searchingKandidatos: false,
          KandidatosIsEmpty: kan.length > 0
        });
        return this.filtracandidatos(of(kan));
      })
    ).subscribe((k) => this.updateKandidaten(k));
    // Observable con candidatos entonces tengo que buscar en dentro de los candidatos
    this.TriggerCriteriaLP$.pipe(
      withLatestFrom(this.kandidatos$),
      filter(([[slp, ls], k]) => k.length > 0 && ls.mitlagerplatz),
      switchMap(([[slp, ls], k]) => {
        return this.filtracandidatos(of(k));
      })
    ).subscribe((kan) => this.updateKandidaten(kan));
    // Observable para buscar en los numeros de articulos en el servidor.
    this.TriggerCriteriaArtikelNr$.pipe(
      switchMap((an) => {
        this.preparaSearchingPotenciales();
        return this.sesserv.getArtikelPotencials(an);
      })
    ).subscribe((p) => this.updateArtikel(p));
    // Una vez que tengo el articulo tengo que buscar si esta en el Lager.
    this.TriggerBuscaKandidato$.pipe(
      withLatestFrom(this.lager$),
      switchMap(([x, l]) => {
        this.updateEstado({
          ...this._estado,
          kandidatos: new Array<Kandidato>(),
          searchingKandidatos: true
        });
        return this.sesserv.getKandidatosFromArtikel(x.artikelnr, l.cwar);
      })
    ).subscribe((k) => this.updateKandidaten(k));
  }

  filtracandidatos(
    entrada$: Observable<Array<Kandidato>>
  ): Observable<Array<Kandidato>> {
    return entrada$.pipe(
      withLatestFrom(
        this.buscaartikelnr$,
        this.buscaartikelberschreibung$,
        this.buscalagerplatz$
      ),
      map(([k, ban, bab, blp]) => {
        let temp = [...k];
        if (ban.length > 0) {
          temp = temp.filter((x) =>
            x.articulo.artikelnr.toUpperCase().includes(ban)
          );
        }
        if (bab.length > 0) {
          temp = temp.filter((x) =>
            x.articulo.beschreibung.toLowerCase().includes(bab)
          );
        }
        if (blp.length > 0) {
          temp = temp.filter((x) =>
            x.lagerort.lagerplatz.toUpperCase().includes(blp.toUpperCase())
          );
        }
        return temp;
      })
    );
  }

  /* CREAR LOS FORM CONTROL */
  buildArtikelNrFormControl(): FormControl {
    const buscaArtikelNr = new FormControl('');
    buscaArtikelNr.valueChanges.subscribe((sa) =>
      this.udpateSearchArtikelNr(sa)
    );
    return buscaArtikelNr;
  }
  buildLagerPlatzFormControl(): FormControl {
    const buscaLagerplatz = new FormControl('');
    buscaLagerplatz.valueChanges
      .pipe(
        withLatestFrom(this.lager$),
        // debounceTime(500),
        filter(([x, lp]) => lp.mitlagerplatz === true),
        distinctUntilChanged()
      )
      .subscribe(([slp, lg]) => {
        this.updateSearchLagerplatz(slp);
      });
    return buscaLagerplatz;
  }
  buildArtikelBeschreibungFormControl(): FormControl {
    const buscaArtikelBeschr = new FormControl('');
    buscaArtikelBeschr.valueChanges
      // .pipe
      // // debounceTime(500),
      // // filter((x: string) => x.length > 1),
      // // distinctUntilChanged()
      // ()
      .subscribe((sab) => this.updateSearchArtikelBeschreibung(sab));
    return buscaArtikelBeschr;
  }

  udpateSearchArtikelNr(artnr: string) {
    const criterios: SearchArtikelStrings = {
      ...this._estado.articulos.criteria
    };
    criterios.artikelnr = artnr.toUpperCase();
    const articulos: SearchArticulos = {
      ...this._estado.articulos,
      criteria: criterios
    };
    this.updateEstado({ ...this._estado, articulos });
  }
  updateSearchArtikelBeschreibung(artbes: string) {
    const criterios: SearchArtikelStrings = {
      ...this._estado.articulos.criteria
    };
    criterios.artikelbeschreibung = artbes.toLowerCase();
    const articulos: SearchArticulos = {
      ...this._estado.articulos,
      criteria: criterios
    };
    this.updateEstado({ ...this._estado, articulos });
  }
  updateSearchLagerplatz(lp: string) {
    const criterios: SearchLagerPlatzStrings = { ...this._estado.criteriaLP };
    criterios.lagerplatz = lp;
    this.updateEstado({ ...this._estado, criteriaLP: criterios });
  }

  updatePotencialSelected(selpot: Artikel) {
    const losarti: SearchArticulos = {
      ...this._estado.articulos,
      selectedPotencial: selpot
    };
    this.updateEstado({ ...this._estado, articulos: losarti });
  }
  clearAllFields() {
    this.buscaArtikelNrFC.setValue('', { emitEvent: false });
    this.buscaLagerPlatzFC.setValue('', { emitEvent: false });
    this.buscaArtikelBeschreibungFC.setValue('', { emitEvent: false });

    const criterios: SearchArtikelStrings = {
      ...this._estado.articulos.criteria
    };
    const criterioslp: SearchLagerPlatzStrings = { ...this._estado.criteriaLP };
    criterios.artikelbeschreibung = '';
    criterios.artikelnr = '';
    const articulos: SearchArticulos = {
      criteria: criterios,
      potenciales: new Array<Artikel>(),
      selectedPotencial: null,
      isSearchingPotenciales: false,
      noPotenciales: true
    };
    const nestado: SearchKandidatosState = {
      articulos,
      kandidatos: new Array<Kandidato>(),
      criteriaLP: criterioslp,
      searchingKandidatos: false,
      KandidatosIsEmpty: true
    };
    this.updateEstado(nestado);
  }
  clearArtikelNrField() {
    this.buscaArtikelNrFC.setValue('', { emitEvent: false });
    const criterios: SearchArtikelStrings = {
      ...this._estado.articulos.criteria
    };
    criterios.artikelnr = '';
    const articulos: SearchArticulos = {
      ...this._estado.articulos,
      criteria: criterios
    };
    this.updateEstado({ ...this._estado, articulos });
  }
  clearArtikelBeschreibungField() {
    this.buscaArtikelBeschreibungFC.setValue('', { emitEvent: false });
    const criterios: SearchArtikelStrings = {
      ...this._estado.articulos.criteria
    };
    criterios.artikelbeschreibung = '';
    const articulos: SearchArticulos = {
      ...this._estado.articulos,
      criteria: criterios
    };
    this.updateEstado({ ...this._estado, articulos });
  }
  clearLagerPlatzField() {
    this.buscaLagerPlatzFC.setValue('', { emitEvent: false });
    const criteriolp: SearchLagerPlatzStrings = { ...this._estado.criteriaLP };
    criteriolp.lagerplatz = '';
    this.updateEstado({ ...this._estado, criteriaLP: criteriolp });
  }

  private updateEstado(nuevoEstado: SearchKandidatosState) {
    // console.log(`Nuevo Estado: ${JSON.stringify(nuevoEstado)}`);

    this.estado.next((this._estado = nuevoEstado));
  }
  private updateArtikel(artikel: Array<Artikel>) {
    const art: SearchArticulos = { ...this._estado.articulos };
    art.potenciales = artikel;
    art.selectedPotencial = null;
    art.isSearchingPotenciales = false;
    art.noPotenciales = true;
    if (artikel.length === 1) {
      art.noPotenciales = false;
      art.selectedPotencial = artikel[0];
    }
    if (artikel.length > 1) {
      art.noPotenciales = false;
    }
    this.updateEstado({ ...this._estado, articulos: art });
  }
  private preparaSearchingPotenciales() {
    const art: SearchArticulos = { ...this._estado.articulos };
    art.potenciales = new Array<Artikel>();
    art.isSearchingPotenciales = true;
    art.noPotenciales = true;
    art.selectedPotencial = null;
    this.updateEstado({
      ...this._estado,
      kandidatos: new Array<Kandidato>(),
      articulos: art
    });
  }
  private updateKandidaten(kand: Array<Kandidato>) {
    this.updateEstado({
      ...this._estado,
      kandidatos: kand,
      searchingKandidatos: false,
      KandidatosIsEmpty: kand.length === 0
    });
  }
}
