import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';
import { SesionPos } from 'src/app/models/sespos.model';
import {
  Observable,
  Subject,
  merge,
  empty,
  of,
  BehaviorSubject,
  Subscription
} from 'rxjs';
import { MatCheckbox, MatCheckboxChange, Sort } from '@angular/material';
import {
  map,
  distinctUntilChanged,
  withLatestFrom,
  switchMap,
  tap,
  debounceTime,
  startWith
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Paginador } from 'src/app/helpers-module/paginador/paginador.component';
import { Validador } from 'src/app/helpers-module/Validador/validador.model';
import {
  TipoCampoBusqueda,
  CampoBusqueda,
  ConjuntoCampos
} from 'src/app/services/facade/controlListe/CampoBusqueda.model';
import { SessionsService } from 'src/app/services/sessions.service';
import { Localizador } from 'src/app/models/lagerort.model';

@Component({
  selector: 'app-pos-index',
  templateUrl: 'pos-index.component.html',
  styleUrls: ['pos-index.component.scss']
})
export class PosIndexComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() loading: boolean;
  @Input() posiciones: Observable<Array<SesionPos>>;
  @Output() delete = new EventEmitter<SesionPos>();
  @Output() gotoPosition = new EventEmitter<SesionPos>();

  @ViewChild('nichtgezahltonly', { static: true })
  gezcheckbox: MatCheckbox;

  fcartnum: Validador;
  fcartbez: Validador;
  floca: Validador;

  mipaginador: Paginador<SesionPos>;

  cbartikelnr: CampoBusqueda<SesionPos, string>;
  cbartikelbe: CampoBusqueda<SesionPos, string>;
  cbloca: CampoBusqueda<SesionPos, string>;

  conjuntos: ConjuntoCampos<SesionPos>;

  constructor(private ss: SessionsService) {}

  ngOnInit() {
    this.cbartikelnr = new CampoBusqueda<SesionPos, string>('ArtikelNR');
    this.cbartikelbe = new CampoBusqueda<SesionPos, string>('ArtikelBes');
    this.cbloca = new CampoBusqueda<SesionPos, string>('Loca');

    this.cbartikelnr.filtro = (sp, t) => {
      return sp.artikel.artikelnr.toUpperCase().includes(t.toUpperCase());
    };
    this.cbartikelnr.iniciofiltro = (t: string) => t.length > 1;

    this.cbartikelbe.filtro = (sp, t) => {
      return sp.artikel.beschreibung.toLowerCase().includes(t.toLowerCase());
    };
    this.cbartikelbe.iniciofiltro = (t: string) => t.length > 2;

    this.cbloca.filtro = (sp, t) => {
      return sp.localizador.lagerplatz.toUpperCase().includes(t.toUpperCase());
    };
    this.cbloca.iniciofiltro = (t: string) => t.length > 1;
    this.fcartnum = new Validador(this.cbartikelnr.formulario);
    this.fcartbez = new Validador(this.cbartikelbe.formulario);
    this.floca = new Validador(this.cbloca.formulario);

    const ck: TipoCampoBusqueda<SesionPos> = {
      nombrecampo: 'NoContados',
      valuechanges$: this.gezcheckbox.change.pipe(
        map((v) => ({ campo: 'NoContados', valor: v.checked })),
        debounceTime(100),
        startWith({ campo: 'NoContados', valor: false })
      ),
      value: this.gezcheckbox.value,
      filtro: (sp, v) => {
        return v ? sp.gezahlt.length === 0 : true;
      },
      iniciofiltro: (v) => true
    };

    this.conjuntos = new ConjuntoCampos<SesionPos>(this.posiciones, [
      ck,
      this.cbartikelnr,
      this.cbartikelbe,
      this.cbloca
    ]);

    this.mipaginador = new Paginador<SesionPos>(this.conjuntos.filtrados$, [
      {
        campo: 'artikel',
        funcascendente: (a, b) =>
          a.artikel.artikelnr < b.artikel.artikelnr ? -1 : 1
      },
      {
        campo: 'lagerplatz',
        funcascendente: (a, b) =>
          a.localizador.lagerplatz < b.localizador.lagerplatz ? -1 : 1
      },
      {
        campo: 'checkedam',
        funcascendente: (a, b) => (a.checkedam < b.checkedam ? -1 : 1)
      }
    ]);
  }

  onSort(cual: Sort) {
    this.mipaginador.onSort(cual);
  }

  onResuelveLocalizador(cual: Localizador): Observable<string> {
    return this.ss.resuelveLagerPlatzRegal(cual);
  }

  ngAfterViewInit() {}
  ngOnDestroy() {}
}
