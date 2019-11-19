import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { BeowachtService } from 'src/app/services/beowacht.service';
import { BeowachtungsListe } from 'src/app/models/beowachliste.model';
import {
  Observable,
  Subject,
  BehaviorSubject,
  merge,
  Subscription,
  combineLatest,
  pipe,
  of,
  from
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  withLatestFrom,
  exhaustMap,
  tap,
  mergeAll,
  mergeMap,
  concatMap,
  catchError
} from 'rxjs/operators';
import { MatCheckbox, MatCheckboxChange, Sort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ExcelService } from 'src/app/services/excel.service';

import { Seleccionador } from 'src/app/helpers-module/seleccionador/seleccionador';
import * as fromLoginSelectors from '../../../root-store/login-store/login.selectors';
import * as fromSesionActions from '../../../root-store/sessions-store/actions';
import { User } from 'src/app/models/user.model';
import { Kandidato } from 'src/app/models/kandidato.model';
import { kandidatoInitialState } from 'src/app/root-store/sessions-store/subestados/Kandidatos.state';
import { Sesion } from 'src/app/models/sesion.model';

@Component({
  selector: 'app-beo-home',
  templateUrl: './homebeowach.component.html',
  styleUrls: ['./homebeowach.component.css']
})
export class HomeBeowachComponent implements OnInit, OnDestroy, AfterViewInit {
  liste$: Observable<Array<BeowachtungsListe>>;
  numarticulos: number;
  data$: Observable<Array<BeowachtungsListe>>;
  datos: Array<BeowachtungsListe>;
  lalista: Array<BeowachtungsListe>;
  subDatos: Subscription;
  subListe: Subscription;
  subUser: Subscription;
  subneueSesion: Subscription;
  usuario: User;
  subcheckbox: Subscription;
  changeSubject$: Subject<MatCheckboxChange>;
  clickNeueSesion$ = new Subject<Event>();
  createsesion$ = this.clickNeueSesion$.asObservable();
  nuevasesion$: Observable<boolean>;
  nuevasesion: Sesion;
  soloohne$: Observable<boolean>;
  bs$: BehaviorSubject<boolean>;
  ordenalo = new BehaviorSubject<Sort>({ active: '', direction: '' });
  selection = new Seleccionador<BeowachtungsListe>();

  estadofiltro = new BehaviorSubject<{ ohnebestellung: boolean; orden: Sort }>({
    ohnebestellung: false,
    orden: { active: '', direction: '' }
  });

  @ViewChild('withoutbestellunbvor', { static: true })
  incheckbox: MatCheckbox;

  constructor(
    private beoservice: BeowachtService,
    private excel: ExcelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.numarticulos = 0;
    this.lalista = new Array<BeowachtungsListe>();
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngAfterViewInit() {}
  ngOnInit() {
    this.data$ = this.beoservice.getBeowachtungsliste();
    this.subcheckbox = this.incheckbox.change
      .pipe(
        map((mec) => mec.checked),
        distinctUntilChanged()
      )
      .subscribe((c) => {
        this.CambioEstado({ ...this.estadofiltro.value, ohnebestellung: c });
      });
    this.liste$ = combineLatest(this.data$, this.estadofiltro).pipe(
      map(([d, e]) => {
        let datos = [...d];
        if (e.ohnebestellung) {
          datos = datos.filter((b) => b.bestellungsvorschlag === null);
        }
        if (!e.orden.active || e.orden.direction === '') {
          return datos;
        }
        this.numarticulos = datos.length;
        return datos.sort((a, b) => {
          const isAsc = e.orden.direction === 'asc';
          switch (e.orden.active) {
            case 'artikelnr':
              return this.compare(
                a.lagercontrol.articulo.artikelnr,
                b.lagercontrol.articulo.artikelnr,
                isAsc
              );
            case 'artikelbes':
              return this.compare(
                a.lagercontrol.articulo.beschreibung,
                b.lagercontrol.articulo.beschreibung,
                isAsc
              );
            default:
              return 0;
          }
        });
      })
    );

    this.subDatos = this.data$.subscribe((l) => {
      this.datos = l;
    });
    this.subListe = this.liste$.subscribe((l) => {
      this.lalista = l;
    });
    this.subUser = this.beoservice
      .getUser()
      .subscribe((u) => (this.usuario = u));
    this.nuevasesion$ = this.createsesion$.pipe(
      switchMap(() => {
        const art = this.selection
          .selected()
          .map((s) => s.lagercontrol.articulo.artikelnr);
        return this.beoservice.crearSesion(this.usuario.emno, art);
      }),
      switchMap((s) => {
        return this.router.navigate(['/sessions/session', s.idSesion]);
      })
    );
    this.subneueSesion = this.nuevasesion$.subscribe((ns) => {
      console.log('Evento navegar', ns);
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected().length;
    const numRows = this.lalista.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.lalista.forEach((f) => this.selection.select(f));
  }

  private CambioEstado(nuevoestado: {
    ohnebestellung: boolean;
    orden: Sort;
  }): void {
    this.estadofiltro.next(nuevoestado);
  }

  export2Excel() {
    const wb = this.excel.generaWorkBookBeoCheckBestand(this.datos);
    this.excel.grabaWorkbook(wb, 'tests.xlsx');
  }
  ordenadatos(como: Sort) {
    this.CambioEstado({ ...this.estadofiltro.value, orden: como });
  }

  ngOnDestroy() {
    this.subDatos.unsubscribe();
    this.subcheckbox.unsubscribe();
    this.subUser.unsubscribe();
    this.subneueSesion.unsubscribe();
  }

  navDefinition(adonde: BeowachtungsListe) {
    this.router.navigate(
      [
        '../definition',
        {
          lager: adonde.lagercontrol.cwar,
          item: adonde.lagercontrol.articulo.artikelnr
        }
      ],
      { relativeTo: this.route }
    );
  }
  crearSesion() {
    console.log('Emitiendo nuevo event');
    this.clickNeueSesion$.next();
  }
  usuario$(): Observable<User> {
    return this.clickNeueSesion$.pipe(
      switchMap((x) => this.beoservice.getUser())
    );
  }
}
