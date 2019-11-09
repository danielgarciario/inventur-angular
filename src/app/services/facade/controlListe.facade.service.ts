import { Injectable, OnInit } from '@angular/core';
import { LagerControl } from 'src/app/models/lagercontrol.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  filter,
  debounce,
  debounceTime,
  withLatestFrom,
  switchMap
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { BeowachtService } from '../beowacht.service';
import * as moment from 'moment';
import { Capacidades } from 'src/app/models/capacidades.model';
import { NeuArtikelBeowachComponent } from 'src/app/beowach/components/neueartikel/neueartikelbeowach.component';
import { CargadoryCache } from './controlListe/Cargador.model';
import {
  CampoBusqueda,
  ConjuntoCampos
} from './controlListe/CampoBusqueda.model';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { Lager } from 'src/app/models/lager.model';

@Injectable({ providedIn: 'root' })
export class ControlListeFacadeService {
  private artikelListe: CargadoryCache<LagerControl>;
  private kandidatosListe: CargadoryCache<LagerControl>;
  public buscaArtikelNrFC: FormControl;
  public buscaArtBeschFC: FormControl;
  public buscaLagerPlatzFC: FormControl;
  public searchArtikelNrFC: FormControl;
  public searchArtBeschFC: FormControl;
  public searchLagerPlatzFC: FormControl;
  private bArtikelNrCB: CampoBusqueda<LagerControl, string>;
  private bArtikelBeschCB: CampoBusqueda<LagerControl, string>;
  private bLagerPlatzCB: CampoBusqueda<LagerControl, string>;
  private sArtikelNrCB: CampoBusqueda<LagerControl, string>;
  private sArtikelBeschCB: CampoBusqueda<LagerControl, string>;
  private sLagerPlatzCB: CampoBusqueda<LagerControl, string>;

  private busqueda: ConjuntoCampos<LagerControl>;
  private searchKL: ConjuntoCampos<LagerControl>;
  private searchCL: ConjuntoCampos<LagerControl>;

  public isLoadingArtikels$: Observable<boolean>;
  public isLoadingKandidatos$: Observable<boolean>;

  public articulosliste$: Observable<Array<LagerControl>>;
  public searcharticulosliste$: Observable<Array<LagerControl>>;
  public searchkandidatosliste$: Observable<Array<LagerControl>>;

  constructor(private beo: BeowachtService) {
    this.generaCargadores();
    this.generarFormulariosBusquedas();
    this.generarFormulariosSearch();

    this.articulosliste$ = this.busqueda.filtrados$;
    this.searcharticulosliste$ = this.searchCL.encontrados$;
    this.searchkandidatosliste$ = this.searchKL.encontrados$;
  }
  private generaCargadores() {
    this.artikelListe = new CargadoryCache<LagerControl>(
      this.beo.getLagerControl(),
      true
    );
    this.isLoadingArtikels$ = this.artikelListe.isLoading$;
    this.kandidatosListe = new CargadoryCache<LagerControl>(
      this.beo.getKandidatosLagerControl(),
      true
    );
    this.isLoadingKandidatos$ = this.kandidatosListe.isLoading$;
  }
  private generarFormulariosBusquedas() {
    this.bArtikelNrCB = new CampoBusqueda<LagerControl, string>(
      'buscaArtikelNr'
    );
    this.bArtikelNrCB.filtro = (entrada: LagerControl, nrart: string) => {
      return entrada.articulo.artikelnr
        .toUpperCase()
        .includes(nrart.toUpperCase());
    };
    this.bArtikelNrCB.iniciofiltro = (tb: string) => tb.length > 1;
    this.buscaArtikelNrFC = this.bArtikelNrCB.formulario;

    this.bArtikelBeschCB = new CampoBusqueda<LagerControl, string>(
      'buscaArtikelBesch'
    );
    this.bArtikelBeschCB.filtro = (l: LagerControl, bes: string) => {
      return l.articulo.beschreibung.toLowerCase().includes(bes.toLowerCase());
    };
    this.bArtikelBeschCB.iniciofiltro = (tb: string) => tb.length > 2;
    this.buscaArtBeschFC = this.bArtikelBeschCB.formulario;

    this.bLagerPlatzCB = new CampoBusqueda<LagerControl, string>(
      'buscaLagerPlatz'
    );
    this.bLagerPlatzCB.filtro = (l: LagerControl, lp: string) => {
      const lps = l.capacidades.map((y) => y.lagerort.lagerplatz);
      const fil = lps.filter((z) => z.toUpperCase().includes(lp.toUpperCase()));
      return fil.length > 0;
    };
    this.bLagerPlatzCB.iniciofiltro = (tb: string) => tb.length > 1;
    this.buscaLagerPlatzFC = this.bLagerPlatzCB.formulario;
    this.busqueda = new ConjuntoCampos<LagerControl>(this.artikelListe.data$, [
      this.bArtikelNrCB,
      this.bArtikelBeschCB,
      this.bLagerPlatzCB
    ]);
  }
  private generarFormulariosSearch() {
    this.sArtikelNrCB = new CampoBusqueda<LagerControl, string>(
      'searchArtikelNr'
    );
    this.sArtikelNrCB.filtro = (entrada: LagerControl, nrart: string) => {
      return entrada.articulo.artikelnr
        .toUpperCase()
        .includes(nrart.toUpperCase());
    };
    this.sArtikelNrCB.iniciofiltro = (tb: string) => tb.length > 1;
    this.searchArtikelNrFC = this.sArtikelNrCB.formulario;

    this.sArtikelBeschCB = new CampoBusqueda<LagerControl, string>(
      'searchArtikelBesch'
    );
    this.sArtikelBeschCB.filtro = (l: LagerControl, bes: string) => {
      return l.articulo.beschreibung.toLowerCase().includes(bes.toLowerCase());
    };
    this.sArtikelBeschCB.iniciofiltro = (tb: string) => tb.length > 2;
    this.searchArtBeschFC = this.sArtikelBeschCB.formulario;

    this.sLagerPlatzCB = new CampoBusqueda<LagerControl, string>(
      'searchLagerPlatz'
    );
    this.bLagerPlatzCB.filtro = (l: LagerControl, lp: string) => {
      const lps = l.capacidades.map((y) => y.lagerort.lagerplatz);
      const fil = lps.filter((z) => z.toUpperCase().includes(lp.toUpperCase()));
      return fil.length > 0;
    };
    this.sLagerPlatzCB.iniciofiltro = (tb: string) => tb.length > 1;
    this.searchLagerPlatzFC = this.bLagerPlatzCB.formulario;

    this.searchKL = new ConjuntoCampos<LagerControl>(
      this.kandidatosListe.data$,
      [this.sArtikelNrCB, this.sArtikelBeschCB, this.sLagerPlatzCB]
    );
    this.searchCL = new ConjuntoCampos<LagerControl>(this.artikelListe.data$, [
      this.sArtikelNrCB,
      this.sArtikelBeschCB,
      this.sLagerPlatzCB
    ]);
  }

  getLagerControl(cwar: string, item: string): Observable<LagerControl> {
    return this.artikelListe.data$.pipe(
      switchMap((x) =>
        x.filter((y) => y.cwar === cwar && y.articulo.artikelnr === item)
      )
    );
  }

  updateLagerMaxBestand(
    valornuevo: Capacidades,
    valorantiguo: Capacidades,
    lagercontrol: LagerControl
  ): Observable<string> {
    return this.beo
      .updateArtikelLagerPlatzMaxBestand(
        lagercontrol.cwar,
        lagercontrol.articulo.artikelnr,
        valorantiguo.lagerort.lagerplatz,
        valornuevo.lagerort.lagerplatz,
        valorantiguo.maxbtnd,
        valornuevo.maxbtnd
      )
      .pipe(
        map((sal) => {
          if (sal.toUpperCase() !== 'OK') {
            return sal;
          }
          /* sin la capacidad antigua */
          const sincapantiguos = lagercontrol.capacidades.filter(
            (x) =>
              !(
                x.maxbtnd === valorantiguo.maxbtnd &&
                x.lagerort.lager === valorantiguo.lagerort.lager &&
                x.lagerort.lagerplatz === valorantiguo.lagerort.lagerplatz
              )
          );
          /* Anadir capacidad nueva */
          sincapantiguos.push(valornuevo);
          const nart = { ...lagercontrol, capacidades: sincapantiguos };
          this.artikelListe.updateData(
            nart,
            (x) =>
              x.cwar === lagercontrol.cwar &&
              x.articulo.artikelnr === lagercontrol.articulo.artikelnr
          );
          return '';
        })
      );
  }
  updateMeldungsundMindestBestand(
    lagercontrol: LagerControl,
    meldungsbestand: number,
    mindestbestand: number
  ): Observable<string> {
    return this.beo
      .updateArtikelMeldungAndMindestBestand(
        lagercontrol.cwar,
        lagercontrol.articulo.artikelnr,
        meldungsbestand,
        mindestbestand
      )
      .pipe(
        map((sal) => {
          if (sal.toUpperCase() !== 'OK') {
            return sal;
          }
          const nart = { ...lagercontrol};
          nart.meldungsbestand = meldungsbestand;
          nart.mindestbestellmenge = mindestbestand;
          this.artikelListe.updateData(
            nart,
            (x) =>
              x.cwar === lagercontrol.cwar &&
              x.articulo.artikelnr === lagercontrol.articulo.artikelnr
          );
          return '';
        })
      );
  }

  deleteArticulo(cual: LagerControl): Observable<string> {
    return this.beo
      .deleteArtikelFromBeowachtungsliste(cual.cwar, cual.articulo.artikelnr)
      .pipe(
        map((sal) => {
          if (sal.toUpperCase() !== 'OK') {
            return sal;
          }
          this.artikelListe.deleteData(
            (x) =>
              x.cwar === cual.cwar &&
              x.articulo.artikelnr === cual.articulo.artikelnr
          );
          return '';
        })
      );
  }
  addArticulo(cual: LagerControl): Observable<string> {
    return this.beo
      .insertNewArtikelFromFesteLagerPlatz(cual.cwar, cual.articulo.artikelnr)
      .pipe(
        map((sal) => {
          if (sal.toUpperCase() !== 'OK') {
            return sal;
          }
          const flps = [...cual.festelagerplaetze];
          const caps = new Array<Capacidades>();
          for (const flp of flps) {
            const ncap: Capacidades = { lagerort: flp.lagerort, maxbtnd: 9999 };
            caps.push(ncap);
          }

          const nar = { ...cual, capacidades: caps };
          this.artikelListe.addNewData(nar);
          return '';
        })
      );
  }
  exportLista2Excel(): void {}
}
