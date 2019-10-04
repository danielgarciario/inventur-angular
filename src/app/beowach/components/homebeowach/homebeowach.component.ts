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
  combineLatest
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';
import { MatCheckbox, MatCheckboxChange, Sort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ExcelService } from 'src/app/services/excel.service';
import { sortAscendingPriority } from '@angular/flex-layout';

@Component({
  selector: 'app-beo-home',
  templateUrl: './homebeowach.component.html',
  styleUrls: ['./homebeowach.component.css']
})
export class HomeBeowachComponent implements OnInit, OnDestroy, AfterViewInit {
  liste$: Observable<Array<BeowachtungsListe>>;
  data$: Observable<Array<BeowachtungsListe>>;
  datos: Array<BeowachtungsListe>;
  subDatos: Subscription;
  subcheckbox: Subscription;
  changeSubject$: Subject<MatCheckboxChange>;
  soloohne$: Observable<boolean>;
  bs$: BehaviorSubject<boolean>;
  ordenalo = new BehaviorSubject<Sort>({ active: '', direction: '' });

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
  ) {}

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
}
